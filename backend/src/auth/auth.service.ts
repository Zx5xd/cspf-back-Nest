import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
      ) {}
    
      // 난수 코드 생성
      private generateRandomCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 숫자 코드
      }
    
      // 회원 가입 시 이메일로 인증 코드 전송
      async register(userEmail: string): Promise<void> {
        const randomCode = this.generateRandomCode();
    
        // JWT 토큰 생성 (payload에 난수 코드 포함)
        const token = this.jwtService.sign({ code: randomCode, email: userEmail });

        const context = {
            code : randomCode,
            username : 'userName'
        };
    
        // 이메일 전송
        await this.mailService.sendEmail(userEmail, context);
      }
    


      // 인증 코드 검증
      async verifyCode(token: string, inputCode: string): Promise<boolean> {
        try {
          const decoded = this.jwtService.verify(token); // 토큰 검증 및 디코딩
          return decoded.code === inputCode; // 입력한 코드가 토큰에 포함된 코드와 일치하는지 확인
        } catch (error) {
          throw new Error('Invalid or expired token');
        }
      }
}
