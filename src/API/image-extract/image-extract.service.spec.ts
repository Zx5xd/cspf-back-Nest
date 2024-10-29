import { Test, TestingModule } from '@nestjs/testing';
import { ImageExtractService } from './image-extract.service';

describe('ImageExtractService', () => {
  let service: ImageExtractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageExtractService],
    }).compile();

    service = module.get<ImageExtractService>(ImageExtractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
