import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';

// Services
import { AppService } from 'app.service';

// Modules
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './_entity/users/users.module.js';
import { OauthSessionsModule } from './_entity/oauth-sessions/oauth-sessions.module.js';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './_entity/products/products.module.js';
import { FeedbackRequestsModule } from './_entity/feedback_requests/feedback_requests.module.js';
import { MainConfigModule } from './_entity/main_config/main_config.module.js';
import { FileUploadModule } from './_services/file/file-upload.module.js';
import { ImagesModule } from './_entity/images/images.module.js';
import { ProductCategoriesModule } from './_entity/product_categories/product_categories.module.js';
import { ShippingModule } from './_services/shipping/shipping.module.js';
import { CartModule } from './_services/cart/cart.module.js';
import { PaymentsModule } from './_services/payments/payments.module.js';
import { OrdersModule } from './_entity/orders/orders.module.js';
import { EmailsModule } from './_services/emails/emails.module.js';
import { PreOrdersModule } from './_entity/pre_orders/pre_orders.module.js';
import { SubscriptionsModule } from './_entity/subscriptions/subscriptions.module.js';

@Module({
  imports: [
    AuthModule,
    OauthSessionsModule,
    UsersModule,
    PrismaModule,
    ProductsModule,
    FileUploadModule,
    FeedbackRequestsModule,
    MainConfigModule,
    ImagesModule,
    ProductCategoriesModule,
    ShippingModule,
    CartModule,
    PaymentsModule,
    OrdersModule,
    EmailsModule,
    PreOrdersModule,
    SubscriptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
