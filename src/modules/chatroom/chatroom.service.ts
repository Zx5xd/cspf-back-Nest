import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {ChatRoomEntity} from "@/modules/chatroom/chatroom.entity";
import {Repository} from "typeorm";
import {CreateChatRoomDto} from "@/dto/chatroom.dto";
import {SseService} from "@/utils/sse/sse.service";

@Injectable()
export class ChatRoomService {
    constructor(
        @InjectRepository(ChatRoomEntity)
        private readonly chatRoomRepository: Repository<ChatRoomEntity>,
        private readonly sseService: SseService,
    ) {}

    async create(chatRoomData: CreateChatRoomDto): Promise<string> {
        const room = this.chatRoomRepository.create(chatRoomData);
        await this.chatRoomRepository.save(room)
        this.sseService.sendEvent({
            type: 'chat_created',
            data: JSON.stringify({
                messsage: `예약하신 상담을 진행하실 수 있습니다.`
            }),
        })
        return room.chatRoomID;
    }

    async findAll(): Promise<ChatRoomEntity[]> {
        return await this.chatRoomRepository.find();
    }

    async findOne(roomId:string): Promise<ChatRoomEntity> {
        return await this.chatRoomRepository.findOne({where:{chatRoomID:roomId}});
    }

    async findUserOne(user:string): Promise<ChatRoomEntity> {
        return await this.chatRoomRepository.findOne({where:{}});
    }

    async findUserCreateRooms(userCode:string):Promise<ChatRoomEntity[]> {
        return await this.chatRoomRepository
          .createQueryBuilder("chatRoom")
          .where("chatRoom.accessUser IS NOT NULL")
          .andWhere("JSON_EXTRACT(chatRoom.accessUser, '$.owner') = :userCode", { userCode })
          .getMany();
    }

    async findUserAccessRooms(userCode:string):Promise<ChatRoomEntity[]> {
        return await this.chatRoomRepository
          .createQueryBuilder("chatRoom")
          .where("chatRoom.accessUser IS NOT NULL")
          .andWhere("JSON_CONTAINS(chatRoom.accessUser->'$.access', :userCode)", { userCode: `"${userCode}"` })
          .getMany();

    }

    async consultEndUpdate(updateData: Partial<ChatRoomEntity>): Promise<void> {
        await this.chatRoomRepository.update({consultEndTime:new Date()},updateData);
    }
}