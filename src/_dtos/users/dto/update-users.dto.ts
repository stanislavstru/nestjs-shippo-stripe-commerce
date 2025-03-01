import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsersDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  first_name?: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  last_name?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  address?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  address2?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  city?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  state?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  zip?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  phone?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  email?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  instagram?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  picture?: string | null;
}
