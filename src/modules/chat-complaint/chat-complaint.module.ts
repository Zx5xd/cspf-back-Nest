import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatComplaintEntity} from "@/modules/chat-complaint/chatcomp.entity";
import {ExpertEntity} from "@/modules/expert/expert.entity";
import {ChatComplaintController} from "@/modules/chat-complaint/chat-complaint.controller";
import {ChatComplaintService} from "@/modules/chat-complaint/chat-complaint.service";
import {MailService} from "@/utils/mail/mail.service";

@Module({
  imports: [TypeOrmModule.forFeature([ChatComplaintEntity, ExpertEntity])],
  controllers: [ChatComplaintController],
  providers: [ChatComplaintService, MailService],
})
export class ChatComplaintModule {}
