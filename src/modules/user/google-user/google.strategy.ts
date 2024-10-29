import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_KEY,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://hyproz.myds.me:3500/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }
  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, name, emails } = profile;

    return {
      provider: 'google',
      providerId: id,
      givenName: name.givenName,
      familyName: name.familyName,
      email: emails[0].value,
    };
  }
  // user 정보 확인
  // const exUser = await this.authService.validateUser(email);
  // if (exUser) {
  //   const token = await this.authService.getToken({ userId: exUser.userId });
  //   return token;
  // }
  // if (exUser === null) {
  //   const newUser = await this.authService.create({
  //     email,
  //     nickname,
  //     provider,
  //   });
  //   const token = await this.authService.getToken({ userId: newUser.userId });
  //   return token;
  // }
}
