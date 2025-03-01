import { ApiProperty } from '@nestjs/swagger';

export class UsersDto {
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
