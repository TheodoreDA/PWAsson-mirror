import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    description:
      'Should not contain the user that creates the chat. Should contain only one other user, multiple users is not yet fully supported',
    minLength: 1,
    example: ['xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'],
  })
  @IsNotEmpty()
  @ArrayMinSize(1)
  usersUid: string[];
}
