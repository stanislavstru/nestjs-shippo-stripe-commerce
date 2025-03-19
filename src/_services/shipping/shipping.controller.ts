import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShippoService } from './shippo/shippo.service';
import { Address, Parcel, WeightUnitEnum } from 'shippo';
import { MainConfigService } from '@/_entity/main_config/main_config.service';
import { CartService } from '../cart/cart.service';

@Controller('shipping')
@ApiTags('Delivery Options')
export class ShippingController {
  constructor(
    private readonly shippoService: ShippoService,
    private readonly mainConfigService: MainConfigService,
    private readonly cartService: CartService,
  ) {}

  @Post('/calculate')
  async routerToDefineTypeShippingCalculate(
    @Body()
    body: {
      addressTo: Address;
      cart: {
        productId: string;
        quantity: number;
      }[];
    },
  ) {
    if (!body.cart.length) throw new BadRequestException('Cart is empty');

    const { shipping_calculating_service, currency_code, business_country } =
      this.mainConfigService.getConfig([
        'shipping_calculating_service',
        'currency_code',
        'business_country',
      ]);

    if (!shipping_calculating_service) {
      throw new BadRequestException(
        `Shipping type for this weight units not found, property (shipping_calculating_service) --> ${shipping_calculating_service ?? 'n/a'}`,
      );
    }

    // Get the cart information
    const cartInfo = await this.cartService.getCartInformation(body.cart);

    // Get shiping methods accordion to the shipping type
    if (shipping_calculating_service === 'shippo') {
      const preparedParcelObject: Parcel = {
        length: cartInfo.totalDimensions.length.toString(),
        width: cartInfo.totalDimensions.width.toString(),
        height: cartInfo.totalDimensions.height.toString(),
        distanceUnit: cartInfo.totalDimensions.distanceUnit,
        weight: cartInfo.totalWeight.weight.toString(),
        massUnit: cartInfo.totalWeight.weightUnit,
      };

      const customsItem = cartInfo.cart.map((product) => ({
        description: product.title,
        quantity: product.quantity,
        netWeight: product.weight.toString(),
        massUnit: WeightUnitEnum.Lb,
        valueAmount: product.price.toString(),
        valueCurrency: currency_code,
        originCountry: business_country,
      }));

      return this.shippoService.createShipment(
        body.addressTo,
        preparedParcelObject,
        customsItem,
      );
    }

    throw new BadRequestException('Shipping type not found');
  }

  @Get('/get-label/:shipmentId')
  async getLabel(@Query('shipmentId') shipmentId: string) {
    const { shipping_calculating_service } = this.mainConfigService.getConfig([
      'shipping_calculating_service',
    ]);

    if (!shipping_calculating_service) {
      throw new BadRequestException(
        `Shipping type for this weight units not found, property (shipping_calculating_service) --> ${shipping_calculating_service ?? 'n/a'}`,
      );
    }

    if (shipping_calculating_service === 'shippo') {
      return this.shippoService.getLabel(shipmentId);
    }

    throw new BadRequestException(
      'Label maker not found for this shipment shipping_calculating_service',
    );
  }
}
