import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsNotEmpty()
  publicationUid: string;
  @ApiProperty({
    example: 'This is quality content right here!',
    maxLength: 200,
  })
  @IsNotEmpty()
  content: string;
}
