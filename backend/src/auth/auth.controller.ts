// src/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 네이버 로그인 URL
  @Get('naver')
  @UseGuards(AuthGuard('naver')) // Naver 전략 사용
  async naverLogin() {
    // Guard가 작동하여 네이버 로그인 페이지로 리다이렉트함
    console.log('auth/naver 진입');
  }

  // 네이버 로그인 콜백
  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverLoginCallback(@Req() req: Request, @Res() res: Response) {
    console.log('naver/callback 진입');
    // @ts-ignore
    const user = req.user; // 네이버 로그인 성공 후의 사용자 정보
    // @ts-ignore
    console.log(req.user);

    // JWT 토큰 생성 및 사용자 정보를 프론트엔드에 전달
    const jwt = this.authService.createJwtToken(user);

    // JWT 토큰을 포함하여 프론트엔드로 리디렉션
    res.redirect(`http://localhost:5173/auth/naver/callback?token=${jwt}`);
  }
}
