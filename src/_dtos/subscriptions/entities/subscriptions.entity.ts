import { SubscriptionsType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from '../../users/entities/users.entity';

export class SubscriptionsEntity {
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
    nullable: true,
  })
  is_active: boolean | null;
}
