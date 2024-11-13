import { Test, TestingModule } from '@nestjs/testing';
import { InsurerchatService } from './insurerchat.service';

describe('InsurerchatService', () => {
  let service: InsurerchatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsurerchatService],
    }).compile();

    service = module.get<InsurerchatService>(InsurerchatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
