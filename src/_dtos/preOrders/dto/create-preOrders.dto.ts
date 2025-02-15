import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePreOrdersDto {
  @ApiProperty({
    type: () => Object,
  })
  product: Prisma.InputJsonValue;
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
    required: false,
    nullable: true,
  })
  content?: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    default: 'now',
    required: false,
    nullable: true,
  })
  created_at?: Date | null;
}
