import { Test, TestingModule } from '@nestjs/testing';
import { MailauthController } from './mailauth.controller';
import { MailauthService } from './mailauth.service';

describe('MailauthController', () => {
  let controller: MailauthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailauthController],
      providers: [MailauthService],
    }).compile();

    controller = module.get<MailauthController>(MailauthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
