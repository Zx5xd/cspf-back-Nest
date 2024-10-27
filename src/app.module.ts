import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './utils/voicechat/chat.gateway';
import { AniApiService } from './API/aniapi/aniapi.service';
import { AniapiController } from './API/aniapi/aniapi.controller';
import { LawApiService } from './API/lawapi/lawapi.service';
import { LawApiController } from './API/lawapi/lawapi.controller';
import { NewsApiService } from './API/newsapi/newsapi.service';
import { NewsapiController } from './API/newsapi/newsapi.controller';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './utils/mail/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { ImageService } from './modules/image/image.service';
import { ImageController } from './modules/image/image.controller';
import { ScripingService } from './utils/scriping/scriping.service';
import { ScripingController } from './utils/scriping/scriping.controller';
import { MailauthModule } from './utils/mailauth/mailauth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'node:process';
import { AuthController } from './modules/auth/auth.controller';
import { UsersModule } from './modules/users/users.module';
import { PetModule } from './modules/pet/pet.module';
import { ExpertModule } from './modules/expert/expert.module';
import { ImageExtractController } from './API/image-extract/image-extract.controller';
import { ImageExtractService } from './API/image-extract/image-extract.service';
import { ExpertEntity } from './modules/expert/expert.entity';
import { ResvModule } from './resv/resv.module';
import { ChatComplaintModule } from './modules/chat-complaint/chat-complaint.module';

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
          dir: __dirname + '**/**/templates',
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
    TypeOrmModule.forFeature([ExpertEntity]),
    AuthModule,
    MailauthModule,
    UsersModule,
    PetModule,
    ExpertModule,
    ResvModule,
    ChatComplaintModule,
  ],
  controllers: [
    AppController,
    AuthController,
    AniapiController,
    LawApiController,
    NewsapiController,
    ImageController,
    ScripingController,
    ImageExtractController,
  ],
  providers: [
    AppService,
    ChatGateway,
    AniApiService,
    LawApiService,
    NewsApiService,
    ImageService,
    ScripingService,
    ImageExtractService,
  ],
})
export class AppModule {}
