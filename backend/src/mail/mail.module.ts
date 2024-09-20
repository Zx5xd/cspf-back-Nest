import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          secure: false, // TLS 사용시 true로 설정
          auth: {
            user: config.get('MAIL_ID') + config.get('MAIL_KIND'),
            pass: config.get('MAIL_PASS'),
          },
        },
        defaults: {
          // 우리 서비스 이름 Waa와 함께, 답장을 해야할 이메일을 알려준다.
          from: `"No Reply" <${config.get('MAIL_ID') + config.get('MAIL_KIND')}>`,
        },
        template: {
          dir: path.join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
