import { Test, TestingModule } from '@nestjs/testing';
import { ScripingService } from './scriping.service';

describe('ScripingService', () => {
  let service: ScripingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScripingService],
    }).compile();

    service = module.get<ScripingService>(ScripingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
