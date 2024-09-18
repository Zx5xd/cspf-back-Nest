import { Module } from '@nestjs/common';
import { MailauthService } from './mailauth.service';
import { MailauthController } from './mailauth.controller';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {MailService} from "../mail/mail.service";

@Module({
  imports:[
    ConfigModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async(config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {expiresIn: '15m'},
      }),
      inject: [ ConfigService ],
    })
  ],
  controllers: [MailauthController],
  providers: [MailauthService, MailService],
})
export class MailauthModule {}
