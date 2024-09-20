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

  async getChatLog(option:{
    page:number,
    limit:number
  }) {
    const query = this.chatLogRepository
        .createQueryBuilder('chatLog')
        .addSelect('chatRoomID')
        .leftJoin('chatLog.user', 'user')   // user와 조인
        .addSelect(['user.userCode', 'user.username', 'user.nickname']) // 필요한 필드만 선택
        .orderBy('chatLog.createdAt', 'DESC') // 최신순 정렬
        .skip((option.page - 1) * option.limit)             // 몇 번째부터 가져올지
        .take(option.limit);                         // 몇 개의 데이터를 가져올지

    const [results, total] = await query.getManyAndCount();

    return {
      results,
      total,
      currentPage: option.page,
      totalPages: Math.ceil(total / option.limit),
    };
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
