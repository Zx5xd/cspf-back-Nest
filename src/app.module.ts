import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as process from 'process';
import * as Joi from "joi";
import {AuthModule} from "./modules/auth/auth.module";
import {ChatRoomModule} from "./modules/chatroom/chatroom.module";
import {ChatLogModule} from "./modules/chatlog/chatlog.module";
import {AdminModule} from "./modules/admin/admin.module";
import {ImageModule} from "./modules/image/image.module";
import {ChatModule} from "./modules/chat/chat.module";
import {AnnouncementModule} from "./modules/announcement/announcement.module";
import {QuestionsModule} from "./modules/questions/questions.module";
import {ExpertEntity} from "./modules/expert/expert.entity";
import { NewsapiModule } from './API/newsapi/newsapi.module';
import {AniapiModule} from "./API/aniapi/aniapi.module";
import {LawapiModule} from "./API/lawapi/lawapi.module";
import {ExpertModule} from "./modules/expert/expert.module";
import {MailauthModule} from "./utils/mailauth/mailauth.module";
import {MailModule} from "./utils/mail/mail.module";
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "./modules/auth/jwt-auth.guard";
import {ImageExtractModule} from "./API/image-extract/image-extract.module";

@Module({
  imports: [
      ConfigModule.forRoot({
          envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.prod.env',
          isGlobal: true,
          validationSchema: Joi.object({
              NODE_ENV: Joi.string().valid('dev', 'prod').required(),
              DB_HOST: Joi.string().required(),
              DB_PORT: Joi.string().required(),
              DB_USERNAME: Joi.string().required(),
              DB_PASSWD: Joi.string().required(),
              DB_DATABASE: Joi.string().required()
          })
      }),
      TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWD,
          database: process.env.DB_DATABASE,
          entities: ['dist/**/*.entity.js'],
          synchronize: true
      }),
      TypeOrmModule.forFeature([ExpertEntity]),
      UserModule,
      AuthModule,
      ChatRoomModule,
      ChatLogModule,
      AdminModule,
      ImageModule,
      ChatModule,
      AnnouncementModule,
      QuestionsModule,
      NewsapiModule,
      AniapiModule,
      LawapiModule,
      ImageExtractModule,
      ExpertModule,
      MailauthModule,
      MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
