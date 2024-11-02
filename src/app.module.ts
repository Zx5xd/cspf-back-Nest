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
import {ExpertModule} from "./modules/expert/expert.module";

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
      UserModule,
      AuthModule,
      ChatRoomModule,
      ChatLogModule,
      AdminModule,
      ImageModule,
      ChatModule,
      AnnouncementModule,
      QuestionsModule,
      ExpertModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
