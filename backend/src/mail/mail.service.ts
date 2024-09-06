import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

    constructor(private readonly mailerService: MailerService) {}

    async sendEmail(to: string, context: {code: string, username: string}) {
      await this.mailerService
      .sendMail({
        to,
        subject: 'CSPF 이메일 인증번호 안내',
      
      // email.hbs라서 ./email 적어줌. 확장자는 자동 생성
        template: './email',
      
      // 동적으로 들어갈 변수 정의.
        context: {
          code: context.code,
          username: context.username,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
    }
    
}
