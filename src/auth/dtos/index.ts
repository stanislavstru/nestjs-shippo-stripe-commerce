import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'auth/roles/roles.enum';

export class AuthResponseDto {
  @ApiProperty({ type: 'string' })
  access_token: string;

  @ApiProperty({ type: [String], enum: Role })
  roles: Role[];
}
