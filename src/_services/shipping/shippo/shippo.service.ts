import { Injectable } from '@nestjs/common';
import { Shippo, Address, Parcel } from 'shippo';
import {
  Shipment,
  CustomsDeclarationContentsTypeEnum,
  CustomsDeclarationNonDeliveryOptionEnum,
  CustomsItemCreateRequest,
} from 'shippo';
import { MainConfigService } from '_entity/main_config/main_config.service';
import { PrismaService } from 'prisma/prisma.service';
import { TelegramService } from '@/_services/telegram/telegram.service';

@Injectable()
export class ShippoService {
  private shippoClient: Shippo;

  constructor(
    private mainConfigService: MainConfigService,
    private prisma: PrismaService,
    private readonly telegramService: TelegramService,
  ) {
    this.shippoClient = new Shippo({
      apiKeyHeader: process.env.SHIPPO_API_KEY,
      // debugLogger: console,
      // the API version can be globally set, though this is normally not required
      // shippoApiVersion: "<YYYY-MM-DD>",
    });
  }

  async createShipment(
    addressTo: Address,
    parcel: Parcel,
    customsItem: CustomsItemCreateRequest[],
  ): Promise<Exclude<Shipment, 'addressFrom'>> {
    try {
      let customsDeclarationId: string | undefined = undefined;
      const {
        business_owner,
        business_name,
        business_company,
        business_street1,
        business_street2,
        business_city,
        business_state,
        business_zip,
        business_country,
        business_phone,
        business_email,
      } = this.mainConfigService.getConfig([
        'business_owner',
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
      ]);

      const preparedAddressFrom = {
        name: business_name,
        company: business_company,
        street1: business_street1,
        street2: business_street2,
        city: business_city,
        state: business_state,
        zip: business_zip,
        country: business_country,
        email: business_email,
        phone: business_phone,
        owner: business_owner,
      };

      if (addressTo.country !== 'US') {
        console.log('customsDeclarationRequest', {
          contentsType: CustomsDeclarationContentsTypeEnum.Merchandise,
          contentsExplanation: 'Decorative car parts',
          nonDeliveryOption: CustomsDeclarationNonDeliveryOptionEnum.Return,
          certify: true,
          certifySigner: business_owner,
          items: customsItem,
        });

        const customsDeclaration =
          await this.shippoClient.customsDeclarations.create({
            contentsType: CustomsDeclarationContentsTypeEnum.Merchandise,
            contentsExplanation: 'Decorative car parts',
            nonDeliveryOption: CustomsDeclarationNonDeliveryOptionEnum.Return,
            certify: true,
            certifySigner: business_owner,
            items: customsItem,
          });

        console.log('customsDeclaration', customsDeclaration);

        if (customsDeclaration) {
          customsDeclarationId = customsDeclaration.objectId;
        }
      }

      console.log({
        addressFrom: preparedAddressFrom,
        addressTo: addressTo,
        parcels: [parcel],
        async: false,
        ...(customsDeclarationId && {
          customsDeclaration: customsDeclarationId,
        }),
      });

      const shipment = await this.shippoClient.shipments.create({
        addressFrom: preparedAddressFrom,
        addressTo: addressTo,
        parcels: [parcel],
        async: false,
        ...(customsDeclarationId && {
          customsDeclaration: customsDeclarationId,
        }),
        // ...(process.env.SHIPPO_CARRIER_ACCOUNTS
        //   ? { carrierAccounts: process.env.SHIPPO_CARRIER_ACCOUNTS.split(',') }
        //   : {}),
      });

      // Write the shipment to the database
      await this.prisma.shipping_calculation.create({
        data: {
          cart_items: customsItem,
          shipment_object: shipment,
        },
      });

      const extraPriceRecord = await this.mainConfigService.findByKey(
        'shipping_extra_price',
      );
      console.log('extraPriceRecord', extraPriceRecord);
      const extraPrice = Math.max(
        0,
        parseFloat(extraPriceRecord?.config_value ?? '0') || 0,
      );

      const ratesWithExtra =
        extraPrice > 0 && shipment.rates?.length
          ? shipment.rates.map((rate) => {
              const baseAmount = parseFloat(rate.amount) || 0;
              const newAmount = (baseAmount + extraPrice).toFixed(2);
              return { ...rate, amount: newAmount };
            })
          : shipment.rates;

      const shipmentWithExtra = {
        ...shipment,
        rates: ratesWithExtra,
      };

      try {
        await this.telegramService.sendMessage(
          `New shipment calculation - country code: ${addressTo.country}, city: ${addressTo.city}.\n\nItems:\n<pre>${JSON.stringify(
            customsItem.map((item) => {
              return {
                description: item.description,
                quantity: item.quantity,
              };
            }),
          )}</pre>`,
        );
      } catch (error) {
        console.error('Error while sending telegram message', error);
      }

      console.log('extraPriceRecord', extraPriceRecord);
      console.log(shipmentWithExtra);

      return shipmentWithExtra;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }

  async getLabel(objectId: string) {
    try {
      const transaction = await this.shippoClient.transactions.create({
        rate: objectId,
        labelFileType: 'PDF',
        async: false,
      });

      return transaction.labelUrl;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }
}
