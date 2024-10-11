import { Test, TestingModule } from '@nestjs/testing';
import { LawApiService } from './lawapi.service';

describe('LawapiService', () => {
  let service: LawApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LawApiService],
    }).compile();

    service = module.get<LawApiService>(LawApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
