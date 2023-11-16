import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePublicationDto {
  @ApiProperty({
    example: 'Super title!',
  })
  @IsNotEmpty()
  title: string;
  @ApiProperty({
    example: 'Super description!',
  })
  @IsNotEmpty()
  description: string;
}
