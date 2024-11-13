import { Test, TestingModule } from '@nestjs/testing';
import { LawyerchatController } from './lawyerchat.controller';
import { LawyerchatService } from './lawyerchat.service';

describe('LawyerchatController', () => {
  let controller: LawyerchatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LawyerchatController],
      providers: [LawyerchatService],
    }).compile();

    controller = module.get<LawyerchatController>(LawyerchatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
