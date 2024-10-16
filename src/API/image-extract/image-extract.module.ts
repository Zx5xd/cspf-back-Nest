import { Module } from '@nestjs/common';
import { ImageExtractService } from './image-extract.service';
import { ImageExtractController } from './image-extract.controller';

@Module({
  imports: [],
  providers: [ImageExtractService],
  controllers: [ImageExtractController],
  exports: [ImageExtractService],
})
export class ImageExtractModule {}
