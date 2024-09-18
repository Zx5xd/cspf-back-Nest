import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {ChatJwtAdapter} from "./modules/chat/chat-jwt.adapter";
import {JwtService} from "@nestjs/jwt";
import 'dotenv/config';
import process from "process";
import {ConfigService} from "@nestjs/config";
import {ChatRoomService} from "./modules/chatroom/chatroom.service";

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  //app.useGlobalGuards(new JwtAuthGuard());

  app.use(cookieParser());

  const jwtService = app.get(JwtService);
  const chatRoomService = app.get(ChatRoomService);
  const configService = app.get(ConfigService);
  const chatAdapter = new ChatJwtAdapter(app, jwtService,configService,chatRoomService);
  app.useWebSocketAdapter(chatAdapter);

  await app.listen(3000);
}
bootstrap();
