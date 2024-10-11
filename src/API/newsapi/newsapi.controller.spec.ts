import { Test, TestingModule } from '@nestjs/testing';
import { NewsapiController } from './newsapi.controller';

describe('NewsapiController', () => {
  let controller: NewsapiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsapiController],
    }).compile();

    controller = module.get<NewsapiController>(NewsapiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
