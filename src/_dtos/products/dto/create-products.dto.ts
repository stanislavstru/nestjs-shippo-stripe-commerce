import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductsDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  meta_id?: string | null;
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
    required: false,
    nullable: true,
  })
  social_media_links?:
    | Prisma.InputJsonValue
    | Prisma.NullableJsonNullValueInput;
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
    required: false,
    nullable: true,
  })
  description?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  category_id?: string | null;
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
    default: false,
    required: false,
  })
  is_coming_soon?: boolean;
}
