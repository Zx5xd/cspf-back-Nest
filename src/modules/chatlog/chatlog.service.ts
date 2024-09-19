import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ChatLogEntity} from "./chatlog.entity";
import {Repository} from "typeorm";

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

  async getChatLog() {

  }

  async getChatLogFilter(option:{
    roomId:string,
    page:number,
    limit:number
  }) {
    const chatRoomID = option.roomId
    const query = this.chatLogRepository
        .createQueryBuilder('chatLog')
        .innerJoinAndSelect('chatLog.chatRoom', 'chatRoom')
        .where('chatRoom.chatRoomID = :chatRoomID', { chatRoomID })
        .orderBy('chatLog.createdAt', 'DESC') // 최신순 정렬
        .skip((option.page - 1) * option.limit)
        .take(option.limit);

    const [results, total] = await query.getManyAndCount();

    return {
      results,
      total,
      currentPage: option.page,
      totalPages: Math.ceil(total / option.limit),
    };
  }

}
