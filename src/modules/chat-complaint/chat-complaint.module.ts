import { Module } from '@nestjs/common';
import { ChatComplaintService } from './chat-complaint.service';
import { ChatComplaintController } from './chat-complaint.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ExpertEntity} from "../expert/expert.entity";
import {ExpertProfileEntity} from "../expert/expertProfile.entity";
import {ChatComplaintEntity} from "./chatcomp.entity";
import {MailService} from "../../utils/mail/mail.service";

@Module({
  imports: [TypeOrmModule.forFeature([ChatComplaintEntity, ExpertEntity])],
  controllers: [ChatComplaintController],
  providers: [ChatComplaintService, MailService],
})
export class ChatComplaintModule {}
