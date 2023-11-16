import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'The new content that will erase the previous',
    example: 'This is quality content right there!',
  })
  @IsNotEmpty()
  content: string;
}
