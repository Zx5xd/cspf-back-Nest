import {
  Body,
  Controller, Get,
  InternalServerErrorException,
  Param,
  Post, Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}


  @Get(':expertCode')
  getImage(@Param('expertCode') expertCode: string) {
    return this.imageService.getImage(expertCode);
  }

  @Post('cert')
  @UseInterceptors(FileInterceptor('file'))
  async expertImageUpload(
    @UploadedFile() file: Express.Multer.File, // 여기에서 @UploadedFile()이 매개변수 `file` 앞에 있어야 합니다.
  ) {
    try {
      console.log(file);

      return this.imageService.signupCertImage(file.buffer);
    } catch (error) {
      console.error('Error while saving image:', error);
      throw new InternalServerErrorException('Unable to save the image');
    }
  }
}
