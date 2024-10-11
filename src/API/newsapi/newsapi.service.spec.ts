import { Test, TestingModule } from '@nestjs/testing';
import { NewsapiService } from './newsapi.service';

describe('NewsapiService', () => {
  let service: NewsapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsapiService],
    }).compile();

    service = module.get<NewsapiService>(NewsapiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
