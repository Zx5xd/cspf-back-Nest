import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { LawApiService } from './lawapi.service'; // LawApiService 경로에 맞게 수정
import { Response } from 'express';

@Controller('caseLaw')
export class LawApiController {
  constructor(private readonly lawApiService: LawApiService) {}

  @Get()
  async caseLawAPI(@Query('query') query: string, @Res() res: Response) {
    try {
      console.log(`query ${query}`);
      const result = await this.lawApiService.getCaseLaw(query);
      res.json(JSON.stringify(result));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Failed to fetch or parse XML data',
        error: error.message,
      });
    }
  }
}
