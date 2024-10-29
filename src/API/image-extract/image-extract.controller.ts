import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageExtractService } from './image-extract.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

@Controller('imgextract')
export class ImageExtractController {
  constructor(private readonly imageExtractService: ImageExtractService) {}

  @Post('certVision')
  async getCertVision(@Body() img: any) {
    // const jsonString = JSON.stringify(img.img);
    // const imagePath = join(process.cwd(), img.img);
    // const decode = Buffer.from(img, 'base64').toString('utf-8');

    const imagePath = img.img;

    console.log(imagePath);

    // 이미지 파일을 버퍼로 읽기
    const imageBuffer = await readFile(imagePath);

    return this.imageExtractService.detextTextFromImage(imageBuffer);
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
