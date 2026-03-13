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
            phone: customerContact?.phone ?? null,
            roles: [Role.GUEST],
            update_at: new Date(),
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
      const extendedDetails = {
        ...body.shippingDetails,
        recipient: body.customerContact,
      };

      const initialOrder = await this.ordersService.create({
        user_id: userId,
        payment_id: null,
        order_status: 'open',
        order_amount_subtotal: null,
        order_amount_total: null,
        order_amount_discount: null,
        order_amount_shipping: null,
        order_amount_tax: null,
        order_items: JSON.stringify(body.lineItems),
        payment_status: 'pending',
        shipping_order_id: body.shippingDetails.delivery.id,
        shipping_details: JSON.stringify(extendedDetails),
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
        const currency = currencySymbol.config_value ?? '';
        const formatMoney = (amountInCents?: number | null) =>
          typeof amountInCents === 'number'
            ? `${new Decimal(amountInCents).div(100).toFixed(2)}${currency}`
            : 'N/A';
        const formatTextValue = (value?: string | number | null) =>
          value !== undefined && value !== null && value !== ''
            ? String(value)
            : 'N/A';
        const cartToString =
          body?.lineItems
            ?.map((item, index) => {
              const unitAmount = item?.price_data?.unit_amount ?? 0;
              const quantity = item?.quantity ?? 0;
              const lineTotal = unitAmount * quantity;

              return (
                `${index + 1}. ${item.price_data.product_data.name}\n` +
                `   Product ID: ${formatTextValue(item.product_id)}\n` +
                `   Qty: ${quantity}\n` +
                `   Unit price: ${formatMoney(unitAmount)}\n` +
                `   Line total: ${formatMoney(lineTotal)}`
              );
            })
            .join('\n\n') || 'Empty cart';

        const telegramMessage =
          `<b>New order created (not paid yet)</b>\n` +
          `<b>Order number:</b> #${orderAfterPayment.order_number} <i>(${orderAfterPayment.id})</i>\n` +
          `<b>Payment session:</b> ${formatTextValue(result?.id)}\n` +
          `<b>Payment status:</b> ${formatTextValue(result?.payment_status)}\n` +
          `<b>Order status:</b> ${formatTextValue(result?.status)}\n\n` +
          `<b>Amounts</b>\n` +
          `Subtotal: ${formatMoney(result?.amount_subtotal)}\n` +
          `Shipping: ${formatMoney(result?.total_details?.amount_shipping)}\n` +
          `Tax: ${formatMoney(result?.total_details?.amount_tax)}\n` +
          `Discount: ${formatMoney(result?.total_details?.amount_discount)}\n` +
          `Total: ${formatMoney(result?.amount_total)}\n\n` +
          `<b>Customer</b>\n` +
          `${formatTextValue(customerContact.firstName)} ${formatTextValue(customerContact.lastName)}\n` +
          `Email: ${formatTextValue(customerContact.email)}\n` +
          `Phone: ${formatTextValue(customerContact.phone)}\n` +
          `Country: ${formatTextValue(customerContact.country)}\n` +
          `State: ${formatTextValue(customerContact.state)}\n` +
          `City: ${formatTextValue(customerContact.city)}\n` +
          `ZIP: ${formatTextValue(customerContact.zip)}\n` +
          `Address: ${formatTextValue(customerContact.address)}\n` +
          `Address 2: ${formatTextValue(customerContact.address2)}\n\n` +
          `<b>Shipping</b>\n` +
          `Delivery ID: ${formatTextValue(body.shippingDetails?.delivery?.id)}\n` +
          `Estimated days: ${formatTextValue(body.shippingDetails?.delivery?.estimatedDays)}\n` +
          `Duration terms: ${formatTextValue(body.shippingDetails?.delivery?.durationTerms)}\n` +
          `Service ID: ${formatTextValue(body.shippingDetails?.service?.id)}\n` +
          `Provider: ${formatTextValue(body.shippingDetails?.service?.provider)}\n` +
          `Service name: ${formatTextValue(body.shippingDetails?.service?.name)}\n` +
          `Shipping price: ${formatTextValue(body.shippingDetails?.price?.amount)} ${formatTextValue(body.shippingDetails?.price?.currency)}\n\n` +
          `<b>Cart</b>\n${cartToString}`;

        try {
          await this.telegramService.sendMessage(telegramMessage);
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
