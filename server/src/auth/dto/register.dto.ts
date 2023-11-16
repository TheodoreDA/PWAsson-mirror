import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'YourUsername' })
  @IsNotEmpty()
  username: string;
  @ApiProperty({ example: 'YourPassword' })
  @IsNotEmpty()
  password: string;
}
