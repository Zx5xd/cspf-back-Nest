import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import { MailauthService } from './mailauth.service';

@Controller('mailauth')
export class MailauthController {
  constructor(private readonly mailauthService: MailauthService) {}

  // 회원가입 요청 처리
  // @Post('register')
  // async register(@Body('email') email: string) {
  //   await this.authService.register(email);
  //   return { message: 'Verification email sent' };
  // }

  @Get('registerAuth')
  async register(@Body('email') email: string) {
    await this.mailauthService.register(process.env.MAIL_TO);
    return { message: 'Verification email sent' };
  }

  // 인증 코드 검증 요청 처리
  @Post('mailVerify')
  async verify(@Query('token') token: string, @Body('code') code: string) {
    const isValid = await this.mailauthService.verifyCode(token, code);
    if (isValid) {
      return { message: 'Email verified successfully' };
    }
    return { message: 'Invalid verification code' };
  }
}
