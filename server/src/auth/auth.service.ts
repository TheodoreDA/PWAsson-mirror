import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto): Promise<string> {
    return '';
  }

  async register(registerDto: RegisterDto): Promise<string> {
    return '';
  }
}
