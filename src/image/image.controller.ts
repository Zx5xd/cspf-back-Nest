import {Controller, Post, UseInterceptors, UploadedFile, Req} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('detect-text')
  @UseInterceptors(FileInterceptor('file'))
  async detectText(@UploadedFile() file: Express.Multer.File) {
    console.log(`detect-text 진입`);
    console.log(`detect-text: ${file.buffer}`);
    return this.imageService.detextTextFromImage(file.buffer);
  }

  @Post('extract-text')
  @UseInterceptors(FileInterceptor('file'))
  async extractText(@UploadedFile() file: Express.Multer.File) {
    return this.imageService.extractTextFromImage(file.buffer);
  }
}
