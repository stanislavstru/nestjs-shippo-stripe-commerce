import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShippingCalculationDto {
  @ApiProperty({
    type: () => Object,
  })
  cart_items: Prisma.InputJsonValue;
  @ApiProperty({
    type: () => Object,
  })
  shipment_object: Prisma.InputJsonValue;
}
