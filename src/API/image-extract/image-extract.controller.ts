import {
  Controller, Get,
  Post, Req, Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageExtractService } from './image-extract.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('imgextract')
export class ImageExtractController {
  constructor(private readonly imageExtractService: ImageExtractService) {}

  @Get()
  getTest(@Req() req, @Res() res) {
   console.log('getTest');
  }

  @Post('detect-text')
  @UseInterceptors(FileInterceptor('file'))
  async detectText(@UploadedFile() file: Express.Multer.File) {
    console.log(`detect-text 진입`);
    console.log(`detect-text: ${file.buffer}`);
    return this.imageExtractService.detextTextFromImage(file.buffer);
  }

  @Post('extract-text')
  @UseInterceptors(FileInterceptor('file'))
  async extractText(@UploadedFile() file: Express.Multer.File) {
    return this.imageExtractService.extractTextFromImage(file.buffer);
  }
}
