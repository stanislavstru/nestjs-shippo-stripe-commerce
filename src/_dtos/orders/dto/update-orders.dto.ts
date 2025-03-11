import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrdersDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  user_id?: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  payment_id?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  order_status?: string;
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
    nullable: true,
  })
  order_amount_subtotal?: Prisma.Decimal | null;
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
    nullable: true,
  })
  order_amount_total?: Prisma.Decimal | null;
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
    nullable: true,
  })
  order_amount_discount?: Prisma.Decimal | null;
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
    nullable: true,
  })
  order_amount_shipping?: Prisma.Decimal | null;
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
    nullable: true,
  })
  order_amount_tax?: Prisma.Decimal | null;
  @ApiProperty({
    type: () => Object,
    required: false,
  })
  order_items?: Prisma.InputJsonValue;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  payment_status?: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  shipping_order_id?: string | null;
  @ApiProperty({
    type: () => Object,
    required: false,
  })
  shipping_details?: Prisma.InputJsonValue;
  @ApiProperty({
    type: () => Object,
    required: false,
  })
  shipping_options?: Prisma.InputJsonValue;
}
