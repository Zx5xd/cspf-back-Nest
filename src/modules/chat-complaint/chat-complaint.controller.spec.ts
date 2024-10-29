import { Test, TestingModule } from '@nestjs/testing';
import { ChatComplaintController } from './chat-complaint.controller';
import { ChatComplaintService } from './chat-complaint.service';

describe('ChatComplaintController', () => {
  let controller: ChatComplaintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatComplaintController],
      providers: [ChatComplaintService],
    }).compile();

    controller = module.get<ChatComplaintController>(ChatComplaintController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
