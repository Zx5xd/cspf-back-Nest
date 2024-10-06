// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Naver JWT 토큰 생성
  naverJwtToken(user: any) {
    const payload = {
      naverId: user.naverId,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      mobile: user.mobile,
    };
    console.log(`payload: ${JSON.stringify(payload)}`);
    return this.jwtService.sign(payload); // 사용자 정보를 payload로 포함하여 토큰 생성
  }

  // Google JWT 토큰 생성
  googleJwtToken(user: any) {
    const payload = {
      familyName: user.familyName,
      givenName: user.givenName,
      email: user.email,
      provider: user.provider,
      providerId: user.providerId,
    };
    console.log(`payload: ${JSON.stringify(payload)}`);
    return this.jwtService.sign(payload); // 사용자 정보를 payload로 포함하여 토큰 생성
  }
}
