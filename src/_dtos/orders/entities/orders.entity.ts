import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from '../../users/entities/users.entity';

export class OrdersEntity {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  user_id: string;
  @ApiProperty({
    type: () => UsersEntity,
    required: false,
  })
  users?: UsersEntity;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  payment_id: string | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  order_number: number;
  @ApiProperty({
    type: 'string',
  })
  order_status: string;
  @ApiProperty({
    type: 'number',
    format: 'double',
    nullable: true,
  })
  order_amount_subtotal: Prisma.Decimal | null;
  @ApiProperty({
    type: 'number',
    format: 'double',
    nullable: true,
  })
  order_amount_total: Prisma.Decimal | null;
  @ApiProperty({
    type: 'number',
    format: 'double',
    nullable: true,
  })
  order_amount_discount: Prisma.Decimal | null;
  @ApiProperty({
    type: 'number',
    format: 'double',
    nullable: true,
  })
  order_amount_shipping: Prisma.Decimal | null;
  @ApiProperty({
    type: 'number',
    format: 'double',
    nullable: true,
  })
  order_amount_tax: Prisma.Decimal | null;
  @ApiProperty({
    type: () => Object,
  })
  order_items: Prisma.JsonValue;
  @ApiProperty({
    type: 'string',
  })
  payment_status: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  shipping_order_id: string | null;
  @ApiProperty({
    type: () => Object,
  })
  shipping_details: Prisma.JsonValue;
  @ApiProperty({
    type: () => Object,
  })
  shipping_options: Prisma.JsonValue;
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
