import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {LessThan, LessThanOrEqual, Repository} from "typeorm";
import {ChatLogEntity} from "@/modules/chatlog/chatlog.entity";

@Injectable()
export class ChatLogService {

  constructor(
    @InjectRepository(ChatLogEntity)
    private chatLogRepository: Repository<ChatLogEntity>,
  ) {}

  async addChatMessage(roomId:string,userCode:string,msg:string) {
    const type = userCode.charAt(0) == 'U';
    let log:ChatLogEntity;
    if (type) {
      log = this.chatLogRepository.create({
        chatRoom:{chatRoomID:roomId},
        user:{userCode:userCode},
        chatMessage:msg
      });
    } else {
      log = this.chatLogRepository.create({
        chatRoom:{chatRoomID:roomId},
        expert:{expertCode:userCode},
        chatMessage:msg
      });
    }
    await this.chatLogRepository.save(log);
  }

  async addChatMessageList(roomId:string,userCode:string,list:Array<string>) {
    // console.log('addChatMessageList, ',roomId,userCode,list);
    const type = userCode.charAt(0) == 'U';
    for (const value of list) {
      let log:ChatLogEntity;
      if(type){
        log = this.chatLogRepository.create({
          chatRoom:{chatRoomID:roomId},
          user:{userCode:userCode},
          chatImageUrl:value,
          type:'USER'
        });
      }else {
        log = this.chatLogRepository.create({
          chatRoom:{chatRoomID:roomId},
          expert:{expertCode:userCode},
          chatImageUrl:value,
          type:'EXPERT'
        });
      }
      await this.chatLogRepository.save(log);
    }
  }

  // -- 관리자 코드 --
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

    const page = option.page || 1;
    const limit = option.limit || 20;

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
        .skip((page - 1) * limit)
        .take(limit);

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

  // -- 유저&전문가 코드 --
  async getChatLogRoom(roomId:string,count:number=50):Promise<(ChatLogEntity[] | number)[]> {

    console.log('getChatLogRoom, 유저&전문가 코드')
    
    const query = this.chatLogRepository
      .createQueryBuilder('chatLog')
      .innerJoinAndSelect('chatLog.chatRoom', 'chatRoom')
      .where('chatRoom.chatRoomID = :chatRoomID', { chatRoomID:roomId })
      .leftJoin('chatLog.user', 'user')   // user와 조인
      .addSelect(['user.userCode', 'user.username', 'user.nickname']) // 필요한 필드만 선택
      .orderBy('chatLog.createdAt', 'DESC') // 최신순 정렬
      .take(count);

    const result = await query.getManyAndCount();

    return result.reverse()
  }

  // --- 채팅신고 ---
  async complainChat(option: {
    chatLog: number,
    roomId: string,
  }) {
    const chatEntity = await this.chatLogRepository.findOne({
      where: {chatLogID: option.chatLog}
    })

    console.log('cpChat, ', option);

    const chckMessages: ChatLogEntity[] = await this.chatLogRepository.find({
      where: {chatLogID: LessThanOrEqual(option.chatLog), chatRoom: {chatRoomID: option.roomId}},
      // where: {chatRoom: {chatRoomID: option.roomId}, createdAt: LessThanOrEqual(chatEntity.createdAt),},
      order: {chatLogID: 'desc'},
      take: 20,
    })

    console.log('chck,', chckMessages);

    return chckMessages
  }
}

