import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostsDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  title?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  content?: string | null;
  @ApiProperty({
    type: 'string',
    isArray: true,
    required: false,
  })
  images?: string[];
}
