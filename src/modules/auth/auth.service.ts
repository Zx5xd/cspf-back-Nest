// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { expertLoginDto } from '../../dto/expert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpertEntity } from '../expert/expert.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(ExpertEntity)
    private readonly expertRepository: Repository<ExpertEntity>,
  ) {}

  async expertLogin(loginDto: expertLoginDto) {
    console.log('loginDto', loginDto);
    console.log(loginDto.username);
    const findUser = await this.expertRepository.findOne({
      where: { username: loginDto.username, password: loginDto.password },
    });

    console.log(findUser);

    if (findUser.credentialStatus) {
      return {
        success: true,
        message: '로그인 성공!',
      };
    } else {
      return {
        success: false,
        message: '로그인 실패!',
      };
    }
  }

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
