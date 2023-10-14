import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Payload } from 'src/auth/dto/payload';

@Injectable()
export class AccessTokenInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const isGetRequest = request.method == 'GET';
    const excludePaths = [];

    if (isGetRequest && excludePaths.includes(request.url)) {
      return next.handle();
    }

    if (
      !request.headers.authorization ||
      !request.headers.authorization.startsWith('Bearer ')
    )
      throw new BadRequestException('JWT token must be provided.');
    const token = request.headers.authorization.substring(7);

    try {
      const payload: Payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request.body.payload = payload;
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e.message ?? 'JWT exception');
    }
    return next.handle();
  }
}
