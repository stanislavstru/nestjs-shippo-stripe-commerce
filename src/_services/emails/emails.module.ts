import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MainConfigService } from '@/_entity/main_config/main_config.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        port: process.env.SMTP_PORT,
        secure: false,
      },
      defaults: {
        from: `${process.env.SMTP_FROM ? 'WCO Market Team' : 'Feedback'}<${process.env.SMTP_USER}>`,
      },
      template: {
        dir: `${__dirname}/templates`,
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [PrismaService, MainConfigService],
})
export class EmailsModule {}
