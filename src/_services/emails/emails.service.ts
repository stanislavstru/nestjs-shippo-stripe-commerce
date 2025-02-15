import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MainConfigService } from '@/_entity/main_config/main_config.service';

@Injectable()
export class EmailsService {
  // private cachedConfigData: MainConfigType | null = null;

  constructor(
    private readonly mailerService: MailerService,
    private mainConfigService: MainConfigService,
  ) {}

  async sendPaymentSucceededEmail(mailData: {
    to: string;
    customerName: string;
    subtotal: string;
    delivery: string;
    tax: string;
    currencySymbol: string;
    date: string;
    orderNumber: number;
    transactionId: string;
    orderItems?: {
      name: string;
      quantity: number;
      price: string;
    }[];
  }) {
    const { business_company } = this.mainConfigService.getConfig([
      'business_company',
    ]);

    const result = await this.mailerService.sendMail({
      to: mailData.to,
      subject: `Payment Successful 🎉${process.env.CLIENT_APP_NAME ? ` (${process.env.CLIENT_APP_NAME})` : ''}`,
      template: './payment_succeeded.hbs',
      context: {
        ...mailData,
        supportUrl: `${process.env.CLIENT_APP_DOMAIN}/pages/contacts`,
        companyName: business_company ?? '',
        title: 'Thank you for your purchase!',
        year: new Date().getFullYear(),
      },
    });

    console.log('After sending email', result);
  }

  async sendPreOrderCreatedEmail(mailData: {
    to: string;
    customerName: string;
  }) {
    const { business_company } = this.mainConfigService.getConfig([
      'business_company',
    ]);

    console.log('Before sending email', mailData.to);

    const result = await this.mailerService.sendMail({
      to: mailData.to,
      subject: `We have received your pre-order${process.env.CLIENT_APP_NAME ? ` (${process.env.CLIENT_APP_NAME})` : ''}`,
      template: './pre_order_created.hbs',
      context: {
        ...mailData,
        supportUrl: `${process.env.CLIENT_APP_DOMAIN}/pages/contacts`,
        companyName: business_company ?? '',
        title: 'Thank you for your pre-order!',
        year: new Date().getFullYear(),
      },
    });

    console.log('After sending email', result);
  }

  async sendFeedbackRequestEmail(mailData: {
    to: string;
    customerName: string;
  }) {
    const { business_company } = this.mainConfigService.getConfig([
      'business_company',
    ]);

    const result = await this.mailerService.sendMail({
      to: mailData.to,
      subject: `We have received your feedback request${process.env.CLIENT_APP_NAME ? ` (${process.env.CLIENT_APP_NAME})` : ''}`,
      template: './feedback_request.hbs',
      context: {
        ...mailData,
        supportUrl: `${process.env.CLIENT_APP_DOMAIN}/pages/contacts`,
        companyName: business_company ?? '',
        title: 'Thank you for your feedback request!',
        year: new Date().getFullYear(),
      },
    });

    console.log('After sending email', result);
  }
}
