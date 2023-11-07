import { IsNotEmpty } from 'class-validator';

export class CreatePublicationDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
}
