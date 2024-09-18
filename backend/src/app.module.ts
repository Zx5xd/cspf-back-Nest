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

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    AuthModule,
    MailauthModule,
  ],
  controllers: [
    AppController,
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
