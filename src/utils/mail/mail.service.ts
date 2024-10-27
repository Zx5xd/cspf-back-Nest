import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { sendMailDto } from './mail.controller';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendAuthEmail(to: string, context: { code: string; email: string }) {
    await this.mailerService
      .sendMail({
        to,
        subject: 'CSPF 이메일 인증번호 안내',

        // email.hbs라서 ./email 적어줌. 확장자는 자동 생성
        template: './emailAuth',

        // 동적으로 들어갈 변수 정의.
        context: {
          code: context.code,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async sendCertDenialEmail(mailDto: sendMailDto) {
    await this.mailerService
      .sendMail({
        to: mailDto.email,
        subject: 'CSPF 가입 실패 안내',

        // email.hbs라서 ./email 적어줌. 확장자는 자동 생성
        template: './certDenial',

        // // 동적으로 들어갈 변수 정의.
        // context: {
        //     code: context.code,
        // },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async sendWarningSanction(mailDto: sendMailDto) {
    await this.mailerService
      .sendMail({
        to: mailDto.email,
        subject: 'CSPF 계정 삭제 안내',

        // email.hbs라서 ./email 적어줌. 확장자는 자동 생성
        template: './warningSanction',

        // // 동적으로 들어갈 변수 정의.
        // context: {
        //     code: context.code,
        // },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async createSuccess(mailDto: sendMailDto) {
    await this.mailerService
      .sendMail({
        to: mailDto.email,
        subject: 'CSPF 가입 안내',

        // email.hbs라서 ./email 적어줌. 확장자는 자동 생성
        template: './createSuccess',

        // 동적으로 들어갈 변수 정의.
        context: {
          name: mailDto.name,
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
