import { Injectable, BadRequestException } from '@nestjs/common';
import { ProductsEntity } from '@/_dtos/products/entities';
import { MainConfigService } from '@/_entity/main_config/main_config.service';
import { ProductsService } from '@/_entity/products/products.service';
import Decimal from 'decimal.js';

@Injectable()
export class CartService {
  private productsAccrodingToCart:
    | (ProductsEntity & { is_active: boolean })[]
    | null = null;

  constructor(
    private productsService: ProductsService,
    private mainConfigService: MainConfigService,
  ) {}

  private async getProductsAccrodingToCart(
    cart: {
      productId: string;
      quantity: number;
    }[],
  ) {
    const productsFromDB = await this.productsService.findByIds(
      cart.map((item) => item.productId),
    );

    this.productsAccrodingToCart = productsFromDB.map((product) => {
      const cartItem = cart.find((item) => item.productId === product.id);

      if (!cartItem) {
        throw new BadRequestException(
          `Product with id ${product.id} not found in the cart`,
        );
      }

      return {
        ...product,
        quantity: cartItem.quantity,
        is_active: product.quantity >= cartItem.quantity,
      };
    });
  }

  public async getCartInformation(
    cart: {
      productId: string;
      quantity: number;
    }[],
  ) {
    await this.getProductsAccrodingToCart(cart);

    return {
      cart: this.productsAccrodingToCart.map((product) => {
        return {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: product.quantity,
          is_active: product.is_active,
        };
      }),
      totalPrice: this.getTotalPrice(),
      totalWeight: this.getWeightByUnits(),
      totalDimensions: this.getTotalDimensions(),
    };
  }

  private getWeightByUnits() {
    const { product_weight_primary_unit } = this.mainConfigService.getConfig([
      'product_weight_primary_unit',
    ]);

    if (product_weight_primary_unit === 'lb') {
      return this.getTotalWeightInLb();
    }

    throw new BadRequestException(
      `Shipping type for this weight units not found, property (product_weight_primary_unit) --> ${product_weight_primary_unit ?? 'n/a'}`,
    );
  }

  private getTotalPrice() {
    return this.productsAccrodingToCart.reduce((acc, product) => {
      if (!product.is_active) return acc;
      const price = new Decimal(product.price);
      const quantity = new Decimal(product.quantity);

      return acc.plus(price.times(quantity));
    }, new Decimal(0));
  }

  private getTotalWeightInLb() {
    const { product_weight_primary_unit } = this.mainConfigService.getConfig([
      'product_weight_primary_unit',
    ]);

    if (product_weight_primary_unit !== 'lb')
      throw new BadRequestException('Weight unit is not lb');

    const weight = this.productsAccrodingToCart.reduce((acc, product) => {
      if (!product.is_active) return acc;

      const lb = product.item_weight_primary;
      const oz = product.item_weight_secondary;

      return acc.plus(
        new Decimal(lb)
          .plus(new Decimal(oz).dividedBy(16))
          .times(product.quantity),
      );
    }, new Decimal(0));

    return {
      weight,
      weightUnit: product_weight_primary_unit,
    };
  }

  private getTotalDimensions() {
    const { product_dimensions_unit } = this.mainConfigService.getConfig([
      'product_dimensions_unit',
    ]);

    if (product_dimensions_unit !== 'in')
      throw new BadRequestException('Weight unit is not lb');

    return this.productsAccrodingToCart.reduce(
      (acc, product) => {
        if (!product.is_active) return acc;

        const length = product.item_length;
        const width = product.item_width;
        const height = product.item_height;

        if (!length || !width || !height) {
          throw new BadRequestException('Product dimensions are not set');
        }

        if (new Decimal(length) > acc.length) acc.length = new Decimal(length);
        if (new Decimal(width) > acc.width) acc.width = new Decimal(width);

        return {
          ...acc,
          height: acc.height.plus(height * product.quantity),
        };
      },
      {
        length: new Decimal(0),
        width: new Decimal(0),
        height: new Decimal(0),
        distanceUnit: product_dimensions_unit,
      },
    );
  }
}
