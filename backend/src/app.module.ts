import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { AniApiService } from './aniapi/aniapi.service';
import { AniapiController } from './aniapi/aniapi.controller';
import { LawApiService } from './lawapi/lawapi.service';
import { LawApiController } from './lawapi/lawapi.controller';
import { NewsApiService } from './newsapi/newsapi.service';
import { NewsapiController } from './newsapi/newsapi.controller';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { ImageService } from './image/image.service';
import { ImageController } from './image/image.controller';
import { ScripingService } from './scriping/scriping.service';
import { ScripingController } from './scriping/scriping.controller';
import { MailauthModule } from './mailauth/mailauth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'node:process';
import { AuthController } from './auth/auth.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    }),
    AuthModule,
    MailauthModule,
    UsersModule,
  ],
  controllers: [
    AppController,
    AuthController,
    AniapiController,
    LawApiController,
    NewsapiController,
    ImageController,
    ScripingController,
  ],
  providers: [
    AppService,
    ChatGateway,
    AniApiService,
    LawApiService,
    NewsApiService,
    ImageService,
    ScripingService,
  ],
})
export class AppModule {}
