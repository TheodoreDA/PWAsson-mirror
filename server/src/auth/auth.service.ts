import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './dto/payload';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.userService.findByUsername(loginDto.username);

    if (!(await bcrypt.compare(loginDto.password, user.hash)))
      throw new UnauthorizedException();

    const payload: Payload = {
      uid: user.uid,
      username: user.username,
    };
    return await this.createToken(payload);
  }

  async register(registerDto: RegisterDto): Promise<string> {
    const user = await this.userService.create(registerDto);
    const payload: Payload = {
      uid: user.uid,
      username: user.username,
    };

    return await this.createToken(payload);
  }

  // TOKEN FUNCTIONS

  async decodeToken(token: string): Promise<Payload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      console.log(e);
      switch (e.message) {
        case 'jwt expired':
          throw new BadRequestException('JWT token expired.');
        case 'jwt must be provided':
          throw new BadRequestException('JWT token must be provided.');
        default:
          console.log(e.name);
          console.log(e.message);
          throw new BadRequestException('Unknown Exception.');
      }
    }
  }

  async createToken(payload: Payload): Promise<string> {
    try {
      return await this.jwtService.signAsync(payload);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Unknown Exception.');
    }
  }
}
