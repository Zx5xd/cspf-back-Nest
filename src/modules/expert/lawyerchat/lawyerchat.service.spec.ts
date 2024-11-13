import { Test, TestingModule } from '@nestjs/testing';
import { LawyerchatService } from './lawyerchat.service';

describe('LawyerchatService', () => {
  let service: LawyerchatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LawyerchatService],
    }).compile();

    service = module.get<LawyerchatService>(LawyerchatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
