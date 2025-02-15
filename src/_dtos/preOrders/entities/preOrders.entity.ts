import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PreOrdersEntity {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    nullable: true,
  })
  pre_order_number: number | null;
  @ApiProperty({
    type: () => Object,
  })
  product: Prisma.JsonValue;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  product_quantity: number;
  @ApiProperty({
    type: 'string',
  })
  user_address: string;
  @ApiProperty({
    type: 'string',
  })
  user_full_name: string;
  @ApiProperty({
    type: 'string',
  })
  user_email: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  content: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  created_at: Date | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  updated_at: Date | null;
}
