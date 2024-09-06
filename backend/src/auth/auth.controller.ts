import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  // 회원가입 요청 처리
  // @Post('register')
  // async register(@Body('email') email: string) {
  //   await this.authService.register(email);
  //   return { message: 'Verification email sent' };
  // }

  @Get('register')
  async register(@Body('email') email: string) {
    await this.authService.register(process.env.MAIL_USER);
    return { message: 'Verification email sent' };
  }

  // 인증 코드 검증 요청 처리
  @Post('verify')
  async verify(@Query('token') token: string, @Body('code') code: string) {
    const isValid = await this.authService.verifyCode(token, code);
    if (isValid) {
      return { message: 'Email verified successfully' };
    }
    return { message: 'Invalid verification code' };
  }
}
