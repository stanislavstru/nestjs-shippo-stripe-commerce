import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateShippingCalculationDto {
  @ApiProperty({
    type: () => Object,
    required: false,
  })
  cart_items?: Prisma.InputJsonValue;
  @ApiProperty({
    type: () => Object,
    required: false,
  })
  shipment_object?: Prisma.InputJsonValue;
}
