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

    async findOne(roomId:string): Promise<ChatRoomEntity> {
        return await this.chatRoomRepository.findOne({where:{chatRoomID:roomId}});
    }

    async findUserOne(user:string): Promise<ChatRoomEntity> {
        return await this.chatRoomRepository.findOne({where:{}});
    }

    async consultEndUpdate(updateData: Partial<ChatRoomEntity>): Promise<void> {
        await this.chatRoomRepository.update({consultEndTime:new Date()},updateData);
    }
}