import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { StripeService } from './stripe/stripe.service';
// import { StripeRequiredFieldsType } from './stripe/stripe.service';
// import { StripePaymentIntentResponse } from './stripe/dto/StripePaymentIntentResponse.dto';
import { PaymentIntentRequestDto, PaymentIntentResponseDto } from './dtos';
import { MainConfigService } from '@/_entity/main_config/main_config.service';
import { UsersService } from '@/_entity/users/users.service';
import { Role } from '@/auth/roles/roles.enum';
import { OrdersService } from '@/_entity/orders/orders.service';
import { Decimal } from '@prisma/client/runtime/library';
import { TelegramService } from '../telegram/telegram.service';

@Controller('payments')
@ApiTags('Payments variants')
export class PaymentsController {
  constructor(
    private readonly mainConfigService: MainConfigService,
    private readonly stripeService: StripeService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly telegramService: TelegramService,
  ) {}

  @Post('/to-payment-system')
  @ApiBody({ type: PaymentIntentRequestDto })
  @ApiOkResponse({
    type: PaymentIntentResponseDto,
  })
  async routerToPaymentSystem(@Body() body: PaymentIntentRequestDto) {
    const paymentService =
      await this.mainConfigService.findByKey('payment_service');

    const currencySymbol =
      await this.mainConfigService.findByKey('currency_symbol');

    if (!paymentService) {
      throw new BadRequestException(
        `main_config DB table doesn't have filled in correctly to perform this feature with a config_key -> payment_service`,
      );
    }

    let userId: string;

    fetch('https://api.telegram.org')
      .then((res) => console.log('Success', res.status))
      .catch((err) => console.error('Fetch error:', err));

    // #####################################################
    // Saving the user's contact information in the database
    // #####################################################
    if (body?.customerContact) {
      if (!body.customerContact.email) {
        throw new BadRequestException('Customer Email is required');
      }

      const customerContact = body.customerContact;

      const user = await this.usersService.findUnique({
        where: { email: customerContact.email },
      });

      if (!user) {
        const newUser = await this.usersService.createUser({
          first_name: customerContact.firstName,
          last_name: customerContact.lastName,
          email: customerContact.email,
          address: customerContact.address,
          address2: customerContact.address2 ?? null,
          city: customerContact.city,
          state: customerContact.state,
          zip: customerContact.zip,
          phone: customerContact?.phone ?? null,
          roles: [Role.GUEST],
        });

        if (!newUser)
          throw new BadRequestException('Failed to create a new user');

        userId = newUser.id;
      } else {
        const updatedUser = await this.usersService.updateUser({
          where: { id: user.id },
          data: {
            first_name: customerContact.firstName,
            last_name: customerContact.lastName,
            address: customerContact.address,
            address2: customerContact.address2 ?? null,
            city: customerContact.city,
            state: customerContact.state,
            zip: customerContact.zip,
            phone: customerContact?.phone ?? null,
            roles: [Role.GUEST],
          },
        });

        if (!updatedUser)
          throw new BadRequestException('Failed to update user');

        userId = user.id;
      }
    } else {
      throw new BadRequestException('Customer contact is required');
    }

    // #####################################################
    // Redirecting to the payment service
    // #####################################################
    if (paymentService.config_value === 'stripe') {
      const initialOrder = await this.ordersService.create({
        user_id: userId,
        payment_id: '',
        order_status: 'open',
        order_amount_subtotal: null,
        order_amount_total: null,
        order_amount_discount: null,
        order_amount_shipping: null,
        order_amount_tax: null,
        order_items: JSON.stringify(body.lineItems),
        payment_status: 'pending',
        shipping_order_id: body.shippingDetails.delivery.id,
        shipping_details: JSON.stringify(body.shippingDetails),
        shipping_options: JSON.stringify(body.shippingOptions),
      });

      if (!initialOrder) {
        throw new BadRequestException('Failed to create an order');
      }

      console.log('Order created (before strip request): ', initialOrder);

      const result = await this.stripeService.createCheckoutSession(
        body.customerContact,
        body.lineItems,
        body.shippingOptions,
        {
          order_id: initialOrder.id,
          user_id: userId,
        },
      );

      if (!result) {
        throw new BadRequestException('Failed to create a payment session');
      }

      // #####################################################
      // Order creation starts here
      // #####################################################
      const preparedOrder = {
        payment_id: result.id,
        order_status: result.status,
        order_amount_subtotal: result?.amount_subtotal
          ? new Decimal(result.amount_subtotal)
          : null,
        order_amount_total: result?.amount_total
          ? new Decimal(result.amount_total)
          : null,
        order_amount_discount: result?.total_details.amount_discount
          ? new Decimal(result.total_details.amount_discount)
          : null,
        order_amount_shipping: result?.total_details.amount_shipping
          ? new Decimal(result.total_details.amount_shipping)
          : null,
        order_amount_tax: result?.total_details.amount_tax
          ? new Decimal(result.total_details.amount_tax)
          : null,
        payment_status: result.payment_status,
      };

      console.log('Update order on this properties ', preparedOrder);

      const orderAfterPayment = await this.ordersService.update(
        initialOrder.id,
        preparedOrder,
      );

      if (!orderAfterPayment) {
        throw new BadRequestException('Failed to update order');
      }

      if (orderAfterPayment) {
        const customerContact = body.customerContact;
        const cartToString =
          body?.lineItems
            ?.map((item) => {
              return `${item.price_data.product_data.name}, ${item.quantity}x\n`;
            })
            .join(', ') || 'Empty cart';

        try {
          await this.telegramService.sendMessage(
            `<b>Order number: #${orderAfterPayment.order_number}, </b><i>(${orderAfterPayment.id})</i>\nNew order created, but not paid yet. Order from ${customerContact.country}, ${customerContact.city}. Total: ${
              result?.amount_subtotal
                ? new Decimal(result.amount_subtotal / 100) +
                  currencySymbol.config_value
                : null
            }.\n\n<b>Cart:</b>\n${cartToString}`,
          );
        } catch (error) {
          console.error('Error while sending telegram message', error);
        }

        console.log('Order after payment: ', orderAfterPayment);
      } else {
        throw new BadRequestException('Failed to create an order');
      }
      // #####################################################

      return { payment_link: result.url };
    }

    throw new BadRequestException(
      `Payment service ${paymentService.config_value} is not supported`,
    );
  }

  @Post('/webhook')
  async handleWebhook(@Req() req: Request): Promise<void> {
    const paymentService =
      await this.mainConfigService.findByKey('payment_service');

    if (!paymentService) {
      throw new BadRequestException(
        `main_config DB table doesn't have filled in correctly to perform this feature with a config_key -> payment_service`,
      );
    }

    if (paymentService.config_value === 'stripe') {
      const sig = req.headers['stripe-signature'];
      const body = req.body;

      await this.stripeService.webhookEvent(sig, body);

      return null;
    }

    throw new BadRequestException(
      `Payment service ${paymentService.config_value} is not supported`,
    );
  }
}
