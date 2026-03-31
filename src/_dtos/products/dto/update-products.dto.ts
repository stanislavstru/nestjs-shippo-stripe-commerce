import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductsDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  meta_id?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  slug?: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  position?: number;
  @ApiProperty({
    type: 'string',
    isArray: true,
    required: false,
  })
  images?: string[];
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
    required: false,
  })
  title?: string;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  short_description?: string;
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
    required: false,
  })
  quantity?: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  item_weight_primary?: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  item_weight_secondary?: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  item_length?: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  item_width?: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  item_height?: number;
  @ApiProperty({
    type: 'number',
    format: 'double',
    required: false,
  })
  price?: Prisma.Decimal;
  @ApiProperty({
    type: 'boolean',
    default: false,
    required: false,
  })
  is_coming_soon?: boolean;
}
