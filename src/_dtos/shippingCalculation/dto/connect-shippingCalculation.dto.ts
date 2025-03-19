import { ApiProperty } from '@nestjs/swagger';

export class ConnectShippingCalculationDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
}
