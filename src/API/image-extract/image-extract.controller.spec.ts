import { Test, TestingModule } from '@nestjs/testing';
import { ImageExtractController } from './image-extract.controller';
import { ImageExtractService } from './image-extract.service';

describe('ImageExtractController', () => {
  let controller: ImageExtractController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageExtractController],
      providers: [ImageExtractService],
    }).compile();

    controller = module.get<ImageExtractController>(ImageExtractController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
