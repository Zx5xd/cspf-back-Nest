import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('*')
  // renderApp(@Res() res: Response){
  //   res.sendFile(join(__dirname, '..', 'client', 'build', 'index.html')); // React 앱의 빌드된 index.html 경로
  // }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
