import { PrismaClient } from '@prisma/client';

const queries = [
  {
    config_key: 'business_name',
    config_value: '',
  },
  {
    config_key: 'business_company',
    config_value: '',
  },
  {
    config_key: 'business_street1',
    config_value: '',
  },
  {
    config_key: 'business_street2',
    config_value: '',
  },
  {
    config_key: 'business_city',
    config_value: '',
  },
  {
    config_key: 'business_state',
    config_value: '',
  },
  {
    config_key: 'business_zip',
    config_value: '',
  },
  {
    config_key: 'business_country',
    config_value: '',
  },
  {
    config_key: 'business_phone',
    config_value: '',
  },
  {
    config_key: 'business_email',
    config_value: '',
  },
  {
    config_key: 'business_owner',
    config_value: '',
  },
];

const prisma = new PrismaClient();

export async function seedConfigContactBusinessQueries() {
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
