import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ShippingCalculationDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: () => Object,
  })
  cart_items: Prisma.JsonValue;
  @ApiProperty({
    type: () => Object,
  })
  shipment_object: Prisma.JsonValue;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  created_at: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  update_at: Date;
}
