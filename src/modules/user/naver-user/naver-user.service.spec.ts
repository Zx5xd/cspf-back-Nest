import { Test, TestingModule } from '@nestjs/testing';
import { NaverUserService } from './naver-user.service';

describe('NaverUserService', () => {
  let service: NaverUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NaverUserService],
    }).compile();

    service = module.get<NaverUserService>(NaverUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
