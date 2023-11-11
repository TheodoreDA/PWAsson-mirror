import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  publicationUid: string;
  @IsNotEmpty()
  content: string;
}
