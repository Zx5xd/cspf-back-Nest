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
    const type = userCode.charAt(0) === 'U';
    let log:ChatLogEntity;
    if (type) {
      log = this.chatLogRepository.create({
        chatRoom:{chatRoomID:roomId},
        user:{userCode:userCode},
        chatMessage:msg,
        type:'USER'
      });
    } else {
      log = this.chatLogRepository.create({
        chatRoom:{chatRoomID:roomId},
        expert:{expertCode:userCode},
        chatMessage:msg,
        type:'EXPERT'
      });
    }

    console.log(log)
    await this.chatLogRepository.save(log);
  }

  async addChatMessageList(roomId:string,userCode:string,list:Array<string>) {
    console.log('addChatMessageList, ',roomId,userCode,list);
    for (const value of list) {
      const log = this.chatLogRepository.create({
        chatRoom:{chatRoomID:roomId},
        user:{userCode:userCode},
        chatImageUrl:value
      });
      await this.chatLogRepository.save(log);
    }
  }

  async getChatLog(option:{
    page:number,
    limit:number
  }) {
    const query = this.chatLogRepository
        .createQueryBuilder('chatLog')
        .leftJoin('chatLog.chatRoom','chatRoom')
        .addSelect(['chatRoom.chatRoomID'])
        .leftJoin('chatLog.user', 'user')   // user와 조인
        .addSelect(['user.userCode', 'user.username', 'user.nickname']) // 필요한 필드만 선택
        .orderBy('chatLog.createdAt', 'DESC') // 최신순 정렬
        .skip((option.page - 1) * option.limit)             // 몇 번째부터 가져올지
        .take(option.limit);                         // 몇 개의 데이터를 가져올지

    const [results, total] = await query.getManyAndCount();

    const formattedResults = results.map((chatLog) => ({
      chatLogID: chatLog.chatLogID,
      createdAt: chatLog.createdAt,
      chatMessage: chatLog.chatMessage,
      chatRoomID: chatLog.chatRoom.chatRoomID, // chatRoomID를 별도로 추출
      user: {
        userCode: chatLog.user.userCode,
        username: chatLog.user.username,
        nickname: chatLog.user.nickname,
      },
    }));

    return {
      results: formattedResults,
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
        .leftJoin('chatLog.chatRoom','chatRoom')
        .addSelect(['chatRoom.chatRoomID'])
        .leftJoin('chatLog.user', 'user')   // user와 조인
        .addSelect(['user.userCode', 'user.username', 'user.nickname']) // 필요한 필드만 선택
        .orderBy('chatLog.createdAt', 'DESC') // 최신순 정렬
        .skip((option.page - 1) * option.limit)
        .take(option.limit);

    const [results, total] = await query.getManyAndCount();

    const formattedResults = results.map((chatLog) => ({
      chatLogID: chatLog.chatLogID,
      createdAt: chatLog.createdAt,
      chatMessage: chatLog.chatMessage,
      chatRoomID: chatLog.chatRoom.chatRoomID, // chatRoomID를 별도로 추출
      user: {
        userCode: chatLog.user.userCode,
        username: chatLog.user.username,
        nickname: chatLog.user.nickname,
      },
    }));

    return {
      results: formattedResults,
      total,
      currentPage: option.page,
      totalPages: Math.ceil(total / option.limit),
    };
  }

}
