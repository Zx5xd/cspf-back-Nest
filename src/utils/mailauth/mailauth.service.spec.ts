import { Test, TestingModule } from '@nestjs/testing';
import { MailauthService } from './mailauth.service';

describe('MailauthService', () => {
  let service: MailauthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailauthService],
    }).compile();

    service = module.get<MailauthService>(MailauthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
