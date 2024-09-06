import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';

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
  controllers: [AuthController],
  providers: [AuthService, MailService],
})
export class AuthModule {}
