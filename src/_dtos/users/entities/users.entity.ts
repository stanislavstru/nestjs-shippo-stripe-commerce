import { ApiProperty } from '@nestjs/swagger';
import { PostsEntity } from '../../posts/entities/posts.entity';
import { OauthSessionsEntity } from '../../oauthSessions/entities/oauthSessions.entity';
import { OrdersEntity } from '../../orders/entities/orders.entity';
import { SubscriptionsEntity } from '../../subscriptions/entities/subscriptions.entity';

export class UsersEntity {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  first_name: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  last_name: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  address: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  address2: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  city: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  state: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  zip: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  phone: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  email: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  instagram: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  picture: string | null;
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  roles: string[];
  @ApiProperty({
    type: () => PostsEntity,
    required: false,
    nullable: true,
  })
  posts?: PostsEntity | null;
  @ApiProperty({
    type: () => OauthSessionsEntity,
    required: false,
    nullable: true,
  })
  oauth_sessions?: OauthSessionsEntity | null;
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
  @ApiProperty({
    type: () => OrdersEntity,
    isArray: true,
    required: false,
  })
  orders?: OrdersEntity[];
  @ApiProperty({
    type: () => SubscriptionsEntity,
    isArray: true,
    required: false,
  })
  subscriptions?: SubscriptionsEntity[];
}
