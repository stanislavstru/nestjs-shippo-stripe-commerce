import { ApiProperty } from '@nestjs/swagger';

const mainConfigKeysEnum = [
  'currency_code',
  'currency_symbol',
  'product_weight_primary_unit',
  'product_weight_secondary_unit',
  'product_dimensions_unit',
  'shipping_calculating_service',
  'shipping_extra_price',
  'payment_service',
  'business_name',
  'business_company',
  'business_street1',
  'business_street2',
  'business_city',
  'business_state',
  'business_zip',
  'business_country',
  'business_phone',
  'business_email',
  'business_owner',
];

export type mainConfigKeysType =
  | 'currency_code'
  | 'currency_symbol'
  | 'product_weight_primary_unit'
  | 'product_weight_secondary_unit'
  | 'product_dimensions_unit'
  | 'shipping_calculating_service'
  | 'shipping_extra_price'
  | 'payment_service'
  | 'business_name'
  | 'business_company'
  | 'business_street1'
  | 'business_street2'
  | 'business_city'
  | 'business_state'
  | 'business_zip'
  | 'business_country'
  | 'business_phone'
  | 'business_email'
  | 'business_owner';

const mainConfigValuesEnum = ['usd', '$', 'lb', 'oz', 'in', 'shippo', 'stripe'];
export type mainConfigValuesType =
  | 'usd'
  | '$'
  | 'lb'
  | 'oz'
  | 'in'
  | 'shippo'
  | 'stripe';

export class MainConfigDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    description: 'Key of the configuration setting',
    enum: mainConfigKeysEnum,
    example: 'currency_code',
  })
  config_key: mainConfigKeysType;

  @ApiProperty({
    description: 'Value of the configuration setting',
    enum: mainConfigValuesEnum,
    example: 'usd',
  })
  config_value: mainConfigValuesType;

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

export class CreateMainConfigDto {
  @ApiProperty({
    description: 'Key of the configuration setting',
    enum: mainConfigKeysEnum,
    example: 'currency_code',
  })
  config_key: mainConfigKeysType;
  @ApiProperty({
    description: 'Value of the configuration setting',
    enum: mainConfigValuesEnum,
    example: 'usd',
  })
  config_value: mainConfigValuesType;
}

export class UpdateMainConfigDto {
  @ApiProperty({
    description: 'Key of the configuration setting',
    enum: mainConfigKeysEnum,
    example: 'currency_code',
  })
  config_key: mainConfigKeysType;
  @ApiProperty({
    description: 'Value of the configuration setting',
    enum: mainConfigValuesEnum,
    example: 'usd',
  })
  config_value: mainConfigValuesType;
}

export type MainConfigType = Record<mainConfigKeysType, mainConfigValuesType>;
