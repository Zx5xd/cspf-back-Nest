import { Test, TestingModule } from '@nestjs/testing';
import { ChatComplaintService } from './chat-complaint.service';

describe('ChatComplaintService', () => {
  let service: ChatComplaintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatComplaintService],
    }).compile();

    service = module.get<ChatComplaintService>(ChatComplaintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
