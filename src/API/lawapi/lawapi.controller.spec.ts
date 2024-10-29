import { Test, TestingModule } from '@nestjs/testing';
import { LawapiController } from './lawapi.controller';

describe('LawapiController', () => {
  let controller: LawapiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LawapiController],
    }).compile();

    controller = module.get<LawapiController>(LawapiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
