import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ProductsDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  meta_id: string | null;
  @ApiProperty({
    type: 'string',
  })
  slug: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  position: number;
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  images: string[];
  @ApiProperty({
    type: () => Object,
    nullable: true,
  })
  social_media_links: Prisma.JsonValue | null;
  @ApiProperty({
    type: 'string',
  })
  title: string;
  @ApiProperty({
    type: 'string',
  })
  short_description: string;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  description: string | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  category_id: string | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  quantity: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  item_weight_primary: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  item_weight_secondary: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  item_length: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  item_width: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  item_height: number;
  @ApiProperty({
    type: 'number',
    format: 'double',
  })
  price: Prisma.Decimal;
  @ApiProperty({
    type: 'boolean',
  })
  is_new: boolean;
  @ApiProperty({
    type: 'boolean',
  })
  is_available: boolean;
  @ApiProperty({
    type: 'boolean',
  })
  is_frozen: boolean;
  @ApiProperty({
    type: 'boolean',
  })
  is_coming_soon: boolean;
  @ApiProperty({
    type: 'boolean',
  })
  is_deleted: boolean;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  created_at: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updated_at: Date;
}
