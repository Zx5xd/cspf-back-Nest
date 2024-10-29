import { Test, TestingModule } from '@nestjs/testing';
import { GoogleUserController } from './google-user.controller';

describe('GoogleUserController', () => {
  let controller: GoogleUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleUserController],
    }).compile();

    controller = module.get<GoogleUserController>(GoogleUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
