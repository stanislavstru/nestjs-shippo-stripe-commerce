import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { ProductsEntity } from '@/_dtos/products/entities';
import Decimal from 'decimal.js';
import { HttpException } from '@nestjs/common';

export class CartInfo {
  data: {
    id: ProductsEntity['id'];
    title: ProductsEntity['title'];
    price: ProductsEntity['price'];
    quantity: ProductsEntity['quantity'];
  }[];
  totalPrice: Decimal;
  totalWeight: Decimal;
  totalDimensions: Decimal;
}

@Controller('cart')
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('find')
  @ApiOkResponse({ type: CartInfo })
  cartInfoByProductIds(
    @Body()
    cart: {
      productId: string;
      quantity: number;
    }[],
  ) {
    try {
      return this.cartService.getCartInformation(cart);
    } catch (err) {
      console.error('Error in getCartInformation:', err);
      throw new HttpException('Failed to get cart info', 500);
    }
  }
}
