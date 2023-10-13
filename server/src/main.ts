import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET, PATCH, POST, DELETE',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (e) => {
        console.error(e);
        throw new BadRequestException(e[0]);
      },
    }),
  );

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
