import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { ChatLogEntity } from "./chatlog.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChatLogService {

  constructor(
    @InjectRepository(ChatLogEntity)
    private chatLogRepository: Repository<ChatLogEntity>,
  ) {}

  async addChatMessage(roomId:string,userCode:string,msg:string) {
    const log = this.chatLogRepository.create({
      chatRoom:{chatRoomID:roomId},
      user:{userCode:userCode},
      chatMessage:msg
    });
    await this.chatLogRepository.save(log);
  }

}
