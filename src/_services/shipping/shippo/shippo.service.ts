import { Injectable } from '@nestjs/common';
import { Shippo, Address, Parcel } from 'shippo';
import { Shipment } from 'shippo';
import { MainConfigService } from '_entity/main_config/main_config.service';

@Injectable()
export class ShippoService {
  private shippoClient: Shippo;

  constructor(private mainConfigService: MainConfigService) {
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
  ): Promise<Exclude<Shipment, 'addressFrom'>> {
    try {
      const addressFrom = await this.mainConfigService.findBusinessContacts();

      if (addressFrom.length === 0)
        return Promise.reject('No business contacts found');

      const preparedAddressFrom = addressFrom.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.config_key.replace('business_', '')]: curr.config_value,
        };
      }, {} as Address);

      const shipment = await this.shippoClient.shipments.create({
        addressFrom: preparedAddressFrom,
        addressTo: addressTo,
        parcels: [parcel],
        async: false,
        // ...(process.env.SHIPPO_CARRIER_ACCOUNTS
        //   ? { carrierAccounts: process.env.SHIPPO_CARRIER_ACCOUNTS.split(',') }
        //   : {}),
      });

      return shipment;
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
