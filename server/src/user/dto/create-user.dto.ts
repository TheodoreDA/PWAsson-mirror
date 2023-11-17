import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'YourUsername',
  })
  @IsNotEmpty()
  username: string;
  @ApiProperty({
    example: 'YourStrongPassword',
  })
  @IsNotEmpty()
  password: string;
}
