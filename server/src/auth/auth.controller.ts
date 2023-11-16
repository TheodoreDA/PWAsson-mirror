import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ description: 'The token as a string', type: String })
  @ApiBadRequestResponse({
    description: 'Most likely a listDocuments error. Could be a JWT error',
  })
  @ApiUnauthorizedResponse({ description: 'Wrong password or username' })
  @ApiConflictResponse({
    description: 'Multiple user with the same username',
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<string> {
    return this.authService.login(loginDto);
  }

  @ApiOkResponse({ description: 'The token as a string' })
  @ApiBadRequestResponse({
    description: 'Username is already used. Could be a JWT error',
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<string> {
    return this.authService.register(registerDto);
  }
}
