import { ArrayMinSize, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @ArrayMinSize(1)
  usersUid: string[];
}
