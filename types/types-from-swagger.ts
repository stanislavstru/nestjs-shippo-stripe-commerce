/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateProductsDto {
  slug: string;
  /** @format int32 */
  position: number;
  images: string[];
  social_media_links?: object | null;
  title: string;
  short_description: string;
  description?: string | null;
  category_id?: string | null;
  /** @format int32 */
  quantity: number;
  /** @format int32 */
  item_weight_primary: number;
  /** @format int32 */
  item_weight_secondary: number;
  /** @format int32 */
  item_length: number;
  /** @format int32 */
  item_width: number;
  /** @format int32 */
  item_height: number;
  /** @format double */
  price: number;
  /** @default false */
  is_coming_soon?: boolean;
}

export interface ProductsEntity {
  id: string;
  slug: string;
  /** @format int32 */
  position: number;
  images: string[];
  social_media_links: object | null;
  title: string;
  short_description: string;
  description: string | null;
  category_id: string | null;
  product_categories?: ProductCategoriesEntity | null;
  /** @format int32 */
  quantity: number;
  /** @format int32 */
  item_weight_primary: number;
  /** @format int32 */
  item_weight_secondary: number;
  /** @format int32 */
  item_length: number;
  /** @format int32 */
  item_width: number;
  /** @format int32 */
  item_height: number;
  /** @format double */
  price: number;
  is_new: boolean;
  is_available: boolean;
  is_frozen: boolean;
  is_coming_soon: boolean;
  is_deleted: boolean;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface ProductCategoriesEntity {
  id: string;
  title: string;
  /** @format int32 */
  position: number;
  image_url: string;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  products?: ProductsEntity[];
}

export interface UpdateProductsDto {
  slug?: string;
  /** @format int32 */
  position?: number;
  images?: string[];
  social_media_links?: object | null;
  title?: string;
  short_description?: string;
  description?: string | null;
  category_id?: string | null;
  /** @format int32 */
  quantity?: number;
  /** @format int32 */
  item_weight_primary?: number;
  /** @format int32 */
  item_weight_secondary?: number;
  /** @format int32 */
  item_length?: number;
  /** @format int32 */
  item_width?: number;
  /** @format int32 */
  item_height?: number;
  /** @format double */
  price?: number;
  /** @default false */
  is_coming_soon?: boolean;
}

export interface CreateFeedbackRequestsDto {
  title?: string | null;
  content?: string | null;
  hide_content?: string | null;
  user_full_name?: string | null;
  user_email?: string | null;
  user_address?: string | null;
  user_phone?: string | null;
  from_path?: string | null;
}

export interface FeedbackRequestsEntity {
  id: string;
  title: string | null;
  content: string | null;
  hide_content: string | null;
  user_full_name: string | null;
  user_email: string | null;
  user_address: string | null;
  user_phone: string | null;
  from_path: string | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  update_at: string;
  processed: boolean;
}

export interface CreateMainConfigDto {
  /**
   * Key of the configuration setting
   * @example "currency_code"
   */
  config_key:
    | 'currency_code'
    | 'currency_symbol'
    | 'product_weight_primary_unit'
    | 'product_weight_secondary_unit'
    | 'product_dimensions_unit'
    | 'shipping_calculating_service'
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
    | 'business_email';
  /**
   * Value of the configuration setting
   * @example "usd"
   */
  config_value: 'usd' | '$' | 'lb' | 'oz' | 'in' | 'shippo' | 'stripe';
}

export interface MainConfigDto {
  id: string;
  /**
   * Key of the configuration setting
   * @example "currency_code"
   */
  config_key:
    | 'currency_code'
    | 'currency_symbol'
    | 'product_weight_primary_unit'
    | 'product_weight_secondary_unit'
    | 'product_dimensions_unit'
    | 'shipping_calculating_service'
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
    | 'business_email';
  /**
   * Value of the configuration setting
   * @example "usd"
   */
  config_value: 'usd' | '$' | 'lb' | 'oz' | 'in' | 'shippo' | 'stripe';
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  update_at: string;
}

export interface UpdateMainConfigDto {
  /**
   * Key of the configuration setting
   * @example "currency_code"
   */
  config_key:
    | 'currency_code'
    | 'currency_symbol'
    | 'product_weight_primary_unit'
    | 'product_weight_secondary_unit'
    | 'product_dimensions_unit'
    | 'shipping_calculating_service'
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
    | 'business_email';
  /**
   * Value of the configuration setting
   * @example "usd"
   */
  config_value: 'usd' | '$' | 'lb' | 'oz' | 'in' | 'shippo' | 'stripe';
}

export interface ImagesEntity {
  id: string;
  image_url: string;
  image_type: string;
  /** @format int32 */
  image_size: number;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  update_at: string;
}

export interface CreateProductCategoriesDto {
  title: string;
  /** @format int32 */
  position: number;
  image_url: string;
}

export interface UpdateProductCategoriesDto {
  title?: string;
  /** @format int32 */
  position?: number;
  image_url?: string;
}

export type CartInfo = object;

export interface CustomerContactDto {
  country: string;
  firstName: string;
  lastName: string | null;
  address: string;
  address2: string | null;
  city: string;
  state: string;
  zip: string;
  phone: string | null;
  email: string;
}

export interface PaymentIntentProductDataDto {
  name: string;
}

export interface PaymentIntentPriceDataDto {
  product_data: PaymentIntentProductDataDto;
  unit_amount: number;
}

export interface PaymentIntentLineItemDto {
  /** Price data */
  price_data: PaymentIntentPriceDataDto;
  quantity: number;
  product_id: string;
}

export interface PaymentIntentShippingDetailsPriceDto {
  amount: string;
  currency: string;
}

export interface PaymentIntentShippingDetailDeliveryDto {
  id: string;
  estimatedDays: number | null;
  durationTerms: string;
}

export interface PaymentIntentShippingDetailserviceDto {
  id: string;
  provider: string;
  name: string | null;
  imagesSmall: string | null;
  imagesLarge: string | null;
}

export interface PaymentIntentShippingDetailsDto {
  price: PaymentIntentShippingDetailsPriceDto;
  delivery: PaymentIntentShippingDetailDeliveryDto;
  service: PaymentIntentShippingDetailserviceDto;
}

export interface PaymentIntentFixedAmountDto {
  amount: number;
}

export type PaymentIntentDeliveryEstimateDto = object;

export interface PaymentIntentShippingOptionsDto {
  fixed_amount: PaymentIntentFixedAmountDto;
  display_name: string;
  delivery_estimate: PaymentIntentDeliveryEstimateDto;
}

export interface PaymentIntentRequestDto {
  /** Customer contact */
  customerContact: CustomerContactDto;
  /** Line item array */
  lineItems: PaymentIntentLineItemDto[];
  /** Shipping details */
  shippingDetails: PaymentIntentShippingDetailsDto;
  /** Shipping options array */
  shippingOptions: PaymentIntentShippingOptionsDto[];
}

export interface PaymentIntentResponseDto {
  payment_link: string;
}

export interface CreateOrdersDto {
  user_id: string;
  payment_id: string;
  order_status: string;
  /** @format double */
  order_amount_subtotal?: number | null;
  /** @format double */
  order_amount_total?: number | null;
  /** @format double */
  order_amount_discount?: number | null;
  /** @format double */
  order_amount_shipping?: number | null;
  /** @format double */
  order_amount_tax?: number | null;
  order_items: object;
  payment_status: string;
  shipping_order_id?: string | null;
  shipping_details: object;
  shipping_options: object;
}

export interface PostsEntity {
  id: string;
  user_id: string;
  users?: UsersEntity;
  title: string | null;
  content: string | null;
  images: string[];
  published: boolean;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface OauthSessionsEntity {
  id: string;
  user_id: string;
  users?: UsersEntity;
  session_id: string | null;
  provider_type: string | null;
  access_token: string | null;
  /** @format date-time */
  access_expires_at: string | null;
  refresh_token: string | null;
  /** @format date-time */
  created_at: string;
}

export interface OrdersEntity {
  id: string;
  user_id: string;
  users?: UsersEntity;
  payment_id: string;
  /** @format int32 */
  order_number: number;
  order_status: string;
  /** @format double */
  order_amount_subtotal: number | null;
  /** @format double */
  order_amount_total: number | null;
  /** @format double */
  order_amount_discount: number | null;
  /** @format double */
  order_amount_shipping: number | null;
  /** @format double */
  order_amount_tax: number | null;
  order_items: object;
  payment_status: string;
  shipping_order_id: string | null;
  shipping_details: object;
  shipping_options: object;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  update_at: string;
}

export interface SubscriptionsEntity {
  id: string;
  user_id: string;
  users?: UsersEntity;
  type: 'news' | 'blog';
  /** @format date-time */
  created_at: string | null;
  /** @format date-time */
  updated_at: string | null;
  is_active: boolean | null;
}

export interface UsersEntity {
  id: string;
  first_name: string;
  last_name: string | null;
  address: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  picture: string | null;
  roles: string[];
  posts?: PostsEntity | null;
  oauth_sessions?: OauthSessionsEntity | null;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  update_at: string;
  orders?: OrdersEntity[];
  subscriptions?: SubscriptionsEntity[];
}

export interface CreatePreOrdersDto {
  /**
   * @format int32
   * @default "autoincrement"
   */
  pre_order_number?: number | null;
  product: object;
  /** @format int32 */
  product_quantity: number;
  user_address: string;
  user_full_name: string;
  user_email: string;
  content?: string | null;
  /**
   * @format date-time
   * @default "now"
   */
  created_at?: string | null;
}

export interface PreOrdersEntity {
  id: string;
  /** @format int32 */
  pre_order_number: number | null;
  product: object;
  /** @format int32 */
  product_quantity: number;
  user_address: string;
  user_full_name: string;
  user_email: string;
  content: string | null;
  /** @format date-time */
  created_at: string | null;
  /** @format date-time */
  updated_at: string | null;
}

export interface UpdatePreOrdersDto {
  /**
   * @format int32
   * @default "autoincrement"
   */
  pre_order_number?: number | null;
  product?: object;
  /** @format int32 */
  product_quantity?: number;
  user_address?: string;
  user_full_name?: string;
  user_email?: string;
  content?: string | null;
  /**
   * @format date-time
   * @default "now"
   */
  created_at?: string | null;
}

export interface SubscriptionCreateByTypeDto {
  first_name: string;
  email: string;
  type: 'news' | 'blog';
  instagram?: string;
}

export interface SubscriptionsDto {
  id: string;
  user_id: string;
  type: 'news' | 'blog';
  /** @format date-time */
  created_at: string | null;
  /** @format date-time */
  updated_at: string | null;
  is_active: boolean | null;
}

export interface SubscriptionsByIdDto {
  id: string;
  type: 'news' | 'blog';
  /** @format date-time */
  created_at: string | null;
  /** @format date-time */
  updated_at: string | null;
  is_active: boolean;
}
