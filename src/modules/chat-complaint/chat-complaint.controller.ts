import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatComplaintService } from './chat-complaint.service';
import { chatComplaintDto } from '../../dto/chatComplaint.dto';

@Controller('chatComplaint')
export class ChatComplaintController {
  constructor(private readonly chatComplaintService: ChatComplaintService) {}

  @Post()
  complaintRecieve(@Body() compDto: chatComplaintDto) {
    return this.chatComplaintService.complaintReceive(compDto);
  }

  @Get()
  getAllComplaint() {
    return this.chatComplaintService.getAllComplaint();
  }

  @Get(':compId')
  getComplaintById(@Param('compId') compId: number) {
    return this.chatComplaintService.getComplaintById(compId);
  }

  @Get(':compId/:process')
  processComplaint(
    @Param('compId') compId: number,
    @Param('process') process: number,
  ) {
    return this.chatComplaintService.processComplaintById(compId, process);
  }
}
