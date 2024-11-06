import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { NewsApiService } from './newsapi.service';
import { Response } from 'express';

@Controller('searchNews')
export class NewsapiController {
  constructor(private readonly newsApiService: NewsApiService) {}

  @Get()
  async searchNews(@Query('query') query: string, @Res() res: Response) {
    try {
      const result = await this.newsApiService.getNewsSearch(query);
      res.json(JSON.stringify(result));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Failed to fetch',
        error: error.message,
      });
    }
  }

  @Get()
  async searchNewsPage(@Query('query') query: string, @Query('page') page: string, @Res() res: Response) {
    try {
      const result = await this.newsApiService.getNewsSearchPage(query, page);
      res.json(JSON.stringify(result));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Failed to fetch',
        error: error.message,
      });
    }
  }
}
