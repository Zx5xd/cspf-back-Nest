import { Test, TestingModule } from '@nestjs/testing';
import { AniapiService } from './aniapi.service';

describe('AniapiService', () => {
  let service: AniapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AniapiService],
    }).compile();

    service = module.get<AniapiService>(AniapiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
