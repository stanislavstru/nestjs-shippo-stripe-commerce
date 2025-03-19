import { Module } from '@nestjs/common';
import { ShippoService } from './shippo/shippo.service';
import { ShippingController } from './shipping.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { MainConfigService } from '_entity/main_config/main_config.service';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '@/_entity/products/products.service';
import { TelegramService } from '../telegram/telegram.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShippingController],
  providers: [
    ShippoService,
    MainConfigService,
    CartService,
    ProductsService,
    TelegramService,
  ],
})
export class ShippingModule {}
