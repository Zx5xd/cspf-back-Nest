import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {ChatJwtAdapter} from "./modules/chat/chat-jwt.adapter";
import {JwtService} from "@nestjs/jwt";
import 'dotenv/config';
import {ConfigService} from "@nestjs/config";
import {ChatRoomService} from "./modules/chatroom/chatroom.service";
import {ValidationPipe} from "@nestjs/common";
import {UserService} from "./modules/user/user.service";

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  //app.useGlobalGuards(new JwtAuthGuard());

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const jwtService = app.get(JwtService);
  const chatRoomService = app.get(ChatRoomService);
  const userService = app.get(UserService);
  const configService = app.get(ConfigService);
  const chatAdapter = new ChatJwtAdapter(app, jwtService,configService,chatRoomService,userService);
  app.useWebSocketAdapter(chatAdapter);

  app.enableCors({
    origin: true,
    credentials: true
  });

  await app.listen(3000);
}
bootstrap();
