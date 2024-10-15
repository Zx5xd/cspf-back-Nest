import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatRoomEntity } from "./chatroom.entity";
import { Repository } from "typeorm";
import { CreateChatRoomDto } from "../../dto/chatroom.dto";

@Injectable()
export class ChatRoomService {
    constructor(
        @InjectRepository(ChatRoomEntity)
        private readonly chatRoomRepository: Repository<ChatRoomEntity>,
    ) {}

    async create(chatRoomData: CreateChatRoomDto): Promise<string> {
        const room = this.chatRoomRepository.create(chatRoomData);
        await this.chatRoomRepository.save(room)
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