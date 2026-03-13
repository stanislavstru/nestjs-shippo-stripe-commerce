import { PrismaClient } from '@prisma/client';

const queries = [
  {
    config_key: 'currency_code',
    config_value: 'usd',
  },
  {
    config_key: 'currency_symbol',
    config_value: '$',
  },
  {
    config_key: 'product_weight_primary_unit',
    config_value: 'lb',
  },
  {
    config_key: 'product_weight_secondary_unit',
    config_value: 'oz',
  },
  {
    config_key: 'product_dimensions_unit',
    config_value: 'in',
  },
  {
    config_key: 'shipping_calculating_service',
    config_value: 'shippo',
  },
  {
    config_key: 'shipping_extra_price',
    config_value: '0',
  },
  {
    config_key: 'payment_service',
    config_value: 'stripe',
  },
];

const prisma = new PrismaClient();

export async function seedMainConfig() {
  for (const item of queries) {
    const existing = await prisma.main_config.findFirst({
      where: {
        config_key: item.config_key,
      },
    });

    if (existing) {
      console.log(`Main config with key ${item.config_key} already exists`);
      continue;
    }

    const result = await prisma.main_config.create({
      data: item,
    });
    console.log(result, '\n');
  }
}
