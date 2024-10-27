import { Test, TestingModule } from '@nestjs/testing';
import { ScripingController } from './scriping.controller';

describe('ScripingController', () => {
  let controller: ScripingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScripingController],
    }).compile();

    controller = module.get<ScripingController>(ScripingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
