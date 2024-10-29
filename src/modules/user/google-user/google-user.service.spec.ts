import { Test, TestingModule } from '@nestjs/testing';
import { GoogleUserService } from './google-user.service';

describe('GoogleUserService', () => {
  let service: GoogleUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleUserService],
    }).compile();

    service = module.get<GoogleUserService>(GoogleUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
