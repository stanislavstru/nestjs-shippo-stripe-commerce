import { ApiProperty } from '@nestjs/swagger';

export class CreatePostsDto {
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
  })
  images: string[];
}
