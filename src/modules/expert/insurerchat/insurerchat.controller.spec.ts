import { Test, TestingModule } from '@nestjs/testing';
import { InsurerchatController } from './insurerchat.controller';
import { InsurerchatService } from './insurerchat.service';

describe('InsurerchatController', () => {
  let controller: InsurerchatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsurerchatController],
      providers: [InsurerchatService],
    }).compile();

    controller = module.get<InsurerchatController>(InsurerchatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
