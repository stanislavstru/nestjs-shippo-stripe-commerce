import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionsType } from '@prisma/client';

export class SubscriptionCreateByTypeDto {
  @ApiProperty({ type: 'string', required: true })
  first_name: string;

  @ApiProperty({ type: 'string', required: true })
  email: string;

  @ApiProperty({
    enum: SubscriptionsType,
  })
  type: SubscriptionsType;
}

export class SubscriptionsByIdDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    enum: SubscriptionsType,
  })
  type: SubscriptionsType;
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
  @ApiProperty({
    type: 'boolean',
  })
  is_active: boolean;
}
