import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsNotEmpty()
  chatUid: string;
  @ApiProperty({
    example: 'Hello world! :)',
  })
  @IsNotEmpty()
  content: string;
}
