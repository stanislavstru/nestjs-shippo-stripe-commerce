// stripe.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { MainConfigService } from '@/_entity/main_config/main_config.service';
import { PaymentIntentRequestDto, PaymentIntentLineItemDto } from '../dtos';
import { OrdersService } from '@/_entity/orders/orders.service';
import { ProductsService } from '@/_entity/products/products.service';
import { TelegramService } from '@/_services/telegram/telegram.service';
import { EmailsService } from '@/_services/emails/emails.service';
import { UsersService } from '@/_entity/users/users.service';
import moment from 'moment';
import Decimal from 'decimal.js';

export type ShippingOptionStrypeCustomType = Omit<
  Stripe.Checkout.SessionCreateParams.ShippingOption.ShippingRateData,
  'type' | 'fixed_amount'
> & { fixed_amount: { amount: number } };

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private fundamentalСonfiguration: Stripe.Checkout.SessionCreateParams;
  private readonly endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  constructor(
    private mainConfigService: MainConfigService,
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private readonly telegramService: TelegramService,
    private readonly emailsService: EmailsService,
    private readonly usersService: UsersService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });

    this.fundamentalСonfiguration = {
      payment_method_types: ['card'],
      mode: 'payment',
      automatic_tax: {
        enabled: true,
      },
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    };
  }

  async createCustomer(
    customerContact: PaymentIntentRequestDto['customerContact'] & {
      metadata?: Record<string, string>;
    },
  ): Promise<string> {
    const customers = await this.stripe.customers.list({
      email: customerContact.email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return customers.data[0].id;
    } else {
      const customer = await this.stripe.customers.create({
        email: customerContact.email,
        name: `${customerContact.firstName}${customerContact?.lastName ? ` ${customerContact.lastName}` : ''}`,
        address: {
          line1: customerContact.address,
          city: customerContact.city,
          state: customerContact.state,
          postal_code: customerContact.zip,
          country: 'US',
        },
        ...(customerContact.metadata?.user_id
          ? { metadata: { user_id: customerContact.metadata.user_id } }
          : {}),
      });

      return customer.id;
    }
  }

  async createCheckoutSession(
    customerContact: PaymentIntentRequestDto['customerContact'],
    lineItems: PaymentIntentRequestDto['lineItems'],
    shippingOptions: PaymentIntentRequestDto['shippingOptions'],
    metadata?: Record<string, string>,
  ) {
    // Get customer id
    const customerId = await this.createCustomer({
      ...customerContact,
      metadata: {
        user_id: metadata['user_id'] ?? '',
      },
    });

    // FOR DEBUG
    // const customerInfo = await this.stripe.customers.retrieve(customerId);
    // console.log('customerInfo', customerInfo);

    return await this.stripe.checkout.sessions.create({
      ...this.fundamentalСonfiguration,
      customer: customerId,
      line_items: this.preparedLineItems(lineItems),
      shipping_options: await this.preparedShippingOptions(shippingOptions),
      metadata: {
        customer_name: `${customerContact.firstName}${customerContact?.lastName ? ` ${customerContact.lastName}` : ''}`,
        ...metadata,
      },
    });
  }

  private preparedLineItems(lineItems: PaymentIntentLineItemDto[]) {
    const { currency_code } = this.mainConfigService.getConfig([
      'currency_code',
    ]);

    if (!currency_code) {
      throw new BadRequestException(
        `Shipping type for this weight units not found, property (currency_code) --> ${currency_code ?? 'n/a'}`,
      );
    }

    return lineItems.map((item) => {
      return {
        price_data: {
          ...item.price_data,
          currency: currency_code,
        },
        quantity: item.quantity,
      };
    });
  }

  private preparedShippingOptions(
    shippingOptions: ShippingOptionStrypeCustomType[],
  ) {
    const { currency_code } = this.mainConfigService.getConfig([
      'currency_code',
    ]);

    if (!currency_code) {
      throw new BadRequestException(
        `Shipping type for this weight units not found, property (currency_code) --> ${currency_code ?? 'n/a'}`,
      );
    }

    return shippingOptions.map((option) => {
      return {
        shipping_rate_data: {
          type: 'fixed_amount' as Stripe.Checkout.SessionCreateParams.ShippingOption.ShippingRateData['type'],
          ...option,
          fixed_amount: {
            ...option.fixed_amount,
            currency: currency_code,
          },
        },
      };
    });
  }

  async webhookEvent(sig: any, body: any) {
    let event: Stripe.Event;

    const { currency_symbol } = this.mainConfigService.getConfig([
      'currency_symbol',
    ]);

    if (!currency_symbol) {
      throw new BadRequestException(
        `Shipping type for this weight units not found, property (currency_symbol) --> ${currency_symbol ?? 'n/a'}`,
      );
    }

    // Verify webhook signature
    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        sig,
        this.endpointSecret,
      );
    } catch (err) {
      console.error(`⚠️  Webhook signature verification failed.`, err.message);
      throw new HttpException('Invalid signature', HttpStatus.BAD_REQUEST);
    }

    let orderId;
    let orderStatus;
    let paymentStatus;

    console.log('Event type:', event.type);
    console.log('Event full data:', event);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.async_payment_failed':
        orderId = event.data.object.metadata.order_id;
        orderStatus = 'failed';
        paymentStatus = 'declined';
        break;

      case 'checkout.session.async_payment_succeeded':
        orderId = event.data.object.metadata.order_id;
        orderStatus = 'succeeded';
        paymentStatus = 'completed';
        break;

      case 'checkout.session.completed':
        orderId = event.data.object.metadata.order_id;
        orderStatus = 'succeeded';
        paymentStatus = 'completed';
        break;

      case 'checkout.session.expired':
        orderId = event.data.object.metadata.order_id;
        orderStatus = 'failed';
        paymentStatus = 'expired';
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    console.log('Try change orderId:', orderId);

    // Update order status
    try {
      const order = await this.ordersService.findOne(orderId);

      if (order && orderStatus && paymentStatus) {
        // Update order status
        const result = await this.ordersService.update(order.id, {
          order_status: orderStatus,
          payment_status: paymentStatus,
        });

        if (event.type === 'checkout.session.completed') {
          let orderItems: PaymentIntentLineItemDto[] = [];

          // Change product quantity
          if (typeof order.order_items === 'string') {
            orderItems = JSON.parse(
              order.order_items,
            ) as PaymentIntentLineItemDto[];

            try {
              for (const item of orderItems) {
                const result = await this.productsService.changeQuantity(
                  item.product_id,
                  item.quantity,
                );

                if (result) {
                  console.log(
                    `Product ${item.product_id} quantity was changed on ${result.quantity}`,
                  );
                }
              }
            } catch (error) {
              console.error('Error:', error);
            }
          }

          // Send notification to telegram
          this.telegramService.sendMessage(
            `Order was completed. #${order.order_number}`,
          );

          // Send email to user
          const user = await this.usersService.user({
            id: order.user_id,
          });
          if (user) {
            try {
              await this.emailsService.sendPaymentSucceededEmail({
                to: user.email,
                customerName: `${user.first_name} ${user.last_name}`,
                subtotal: new Decimal(
                  +order.order_amount_subtotal / 100,
                ).toString(),
                delivery: new Decimal(
                  +order.order_amount_shipping / 100,
                ).toString(),
                tax: new Decimal(+order.order_amount_tax / 100).toString(),
                currencySymbol: currency_symbol,
                date: moment(order.created_at).format('MM/DD/YYYY'),
                orderNumber: order.order_number,
                transactionId: order.payment_id,
                orderItems: orderItems.map((item) => ({
                  name: item.price_data.product_data.name,
                  quantity: item.quantity,
                  price: new Decimal(
                    +item.price_data.unit_amount / 100,
                  ).toString(),
                })),
              });
            } catch (error) {
              console.error('Error while sending email', error);
            }
          } else {
            console.error('User not found');
          }
        }

        if (event.type === 'checkout.session.async_payment_failed') {
          // Send notification to telegram
          this.telegramService.sendMessage(
            `Order was failed to pay. #${order.order_number}`,
          );
        }

        if (event.type === 'checkout.session.expired') {
          // Send notification to telegram
          this.telegramService.sendMessage(
            `Order was expired. #${order.order_number}`,
          );
        }

        if (event.type === 'charge.refunded') {
          // Send notification to telegram
          this.telegramService.sendMessage(
            `Order was refunded. #${order.order_number}`,
          );
        }

        console.log(
          result ? 'Orders was chnaged on: ' : 'Failed to update order: ',
          {
            order_id: order.id,
            order_status: orderStatus,
            payment_status: paymentStatus,
          },
        );
      } else {
        console.error('Order not found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
