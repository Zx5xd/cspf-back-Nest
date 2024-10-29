import { Test, TestingModule } from '@nestjs/testing';
import { NaverUserController } from './naver-user.controller';
import { NaverUserService } from './naver-user.service';

describe('NaverUserController', () => {
  let controller: NaverUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NaverUserController],
      providers: [NaverUserService],
    }).compile();

    controller = module.get<NaverUserController>(NaverUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
