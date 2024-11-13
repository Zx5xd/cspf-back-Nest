import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import {MailauthController} from "@/utils/mailauth/mailauth.controller";
import {MailService} from "@/utils/mail/mail.service";
import {MailauthService} from "@/utils/mailauth/mailauth.service";

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_EMAIL_SECRET'),
        signOptions: { expiresIn: '5m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailauthController],
  providers: [MailauthService, MailService],
})
export class MailauthModule {}
