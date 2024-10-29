import { Test, TestingModule } from '@nestjs/testing';
import { AniapiController } from './aniapi.controller';

describe('AniapiController', () => {
  let controller: AniapiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AniapiController],
    }).compile();

    controller = module.get<AniapiController>(AniapiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
