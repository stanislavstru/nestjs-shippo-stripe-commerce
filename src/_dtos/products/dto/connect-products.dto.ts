import { ApiProperty } from '@nestjs/swagger';

export class ConnectProductsDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  id?: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  meta_id?: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  slug?: string;
}
