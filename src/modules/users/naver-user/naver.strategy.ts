// src/auth/strategies/naver.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver-v2';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: 'http://hyproz.myds.me:3500/auth/naver/callback',
    });
  }



  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    // eslint-disable-next-line @typescript-eslint/ban-types
    done: Function,
  ) {
    // 사용자 정보가 profile에 포함되어 있음
    const { id, email, name, mobile, nickname } = profile;
    const user = {
      naverId: id,
      email: email,
      name: name,
      mobile: mobile,
      nickname: nickname,
      refreshToken,
      accessToken,
    };

    // done 함수 호출로 사용자 객체 전달
    done(null, user);
  }
}
