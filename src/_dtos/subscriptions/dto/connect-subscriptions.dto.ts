import { ApiProperty } from '@nestjs/swagger';

export class ConnectSubscriptionsDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
}
