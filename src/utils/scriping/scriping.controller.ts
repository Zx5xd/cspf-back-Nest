import { Body, Controller, Post } from '@nestjs/common';
import { ScripingService } from './scriping.service';

@Controller('scrip')
export class ScripingController {
  constructor(private readonly scripingService: ScripingService) {}

  @Post('news')
  async scripNews(@Body('url') url: string) {
    console.log(`sc controller : ${url}`);
    return this.scripingService.scrapeNewssite(url);
  }

  @Post('laws')
  async scripLaws(@Body('url') url: string) {
    console.log(`sc controller : ${url}`);
    return this.scripingService.ScrapLawsite(url);
  }
}
