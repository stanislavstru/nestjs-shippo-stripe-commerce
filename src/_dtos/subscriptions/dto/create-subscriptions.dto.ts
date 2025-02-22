import { SubscriptionsType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionsDto {
  @ApiProperty({
    type: 'string',
  })
  user_id: string;
  @ApiProperty({
    enum: SubscriptionsType,
  })
  type: SubscriptionsType;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    default: 'now',
    required: false,
    nullable: true,
  })
  created_at?: Date | null;
  @ApiProperty({
    type: 'boolean',
    default: true,
    required: false,
    nullable: true,
  })
  is_active?: boolean | null;
}
