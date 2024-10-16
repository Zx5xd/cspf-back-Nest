import { Controller, Get, Param, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { ExpertEntity } from '../expert/entities/expert.entity';

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
