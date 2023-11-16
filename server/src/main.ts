import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { InitAppWriteClient } from './database/app.database';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  InitAppWriteClient();

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET, PUT, POST, DELETE',
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

  const config = new DocumentBuilder()
    .setTitle('PWAsson')
    .setDescription('School project to integrate a Progressive Web Application')
    .setVersion('0.1')
    .addBearerAuth()
    .addTag('Auth')
    .addTag('User')
    .addTag('Publication')
    .addTag('Comment')
    .addTag('Message')
    .addTag('Chat')
    .addTag('Admin')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
