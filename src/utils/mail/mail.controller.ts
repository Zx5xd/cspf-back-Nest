import { Controller, Get, Query } from '@nestjs/common';
import {MailService} from "@/utils/mail/mail.service";

export interface sendMailDto {
  email: string;
  userCode: string;
  name: string;
}

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('certDenial')
  async certDenial(@Query() expertDto: any) {
    return this.mailService.sendCertDenialEmail(expertDto);
  }

  @Get('createSuccess')
  async createSuccess(@Query() userDto: any) {
    return this.mailService.createSuccess(userDto);
  }
}
