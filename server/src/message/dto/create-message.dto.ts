import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  chatUid: string;
  @IsNotEmpty()
  content: string;
}
