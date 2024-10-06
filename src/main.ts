import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from 'cors';
import * as CookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://hyproz.myds.me:51731',
      'http://hyproz.myds.me:5173',
      'http://localhost:5173',
    ],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true,
  });

  app.use(CookieParser());

  await app.listen(3500, '0.0.0.0');
}
bootstrap();
