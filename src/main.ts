import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as CookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    // origin: [
    //   // 'http://hyproz.myds.me:51731',
    //   // 'http://hyproz.myds.me:5173',
    //   // 'http://localhost:5173',
    //   true,
    // ],
    origin: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true,
  });
  app.useStaticAssets(join(__dirname, '..', '/uploads'), {
    prefix: `/uploads/`,
  });
  app.use(CookieParser());

  await app.listen(3500, '0.0.0.0');
}
bootstrap();
