import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import {MailauthService} from "@/utils/mailauth/mailauth.service";

@Controller('mailauth')
export class MailauthController {
  constructor(private readonly mailauthService: MailauthService) {}

  // 회원가입 요청 처리
  // @Post('register')
  // async register(@Body('email') email: string) {
  //   await this.authService.register(email);
  //   return { message: 'Verification email sent' };
  // }

  @Post('registerAuth')
  async register(
    @Body('email') email: string,
    @Res({ passthrough: true }) res: Response,
  ) {

    console.log(email);

    const payload = await this.mailauthService.register(email);

    // JWT 토큰 생성 (payload에 난수 코드 포함)
    const emailToken = this.mailauthService.setToken(payload, '5m');
    res.cookie('emailToken', emailToken, {
      httpOnly: true,
    });

    return { message: 'Verification email sent' };
  }

  // 인증 코드 검증 요청 처리
  @Post('mailVerify')
  async verify(@Req() req: Request, @Body('code') code: string) {
    console.log(req.body);
    // console.log(req.cookies['emailToken']);
    const token = req.cookies['emailToken'];
    console.log(`mailVerify: ${token} ${code}`);

    const isValid = await this.mailauthService.verifyCode(token, code);

    if (isValid) {
      return { isValid, message: 'Email verified successfully' };
    }
    return { isValid, message: 'Invalid verification code' };
  }
}
