import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {ChatRoomEntity} from "@/modules/chatroom/chatroom.entity";
import {ChatRoomService} from "@/modules/chatroom/chatroom.service";
import {ChatRoomController} from "@/modules/chatroom/chatroom.controller";
import {SseModule} from "@/utils/sse/sse.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([ChatRoomEntity]),
        SseModule
    ],
    providers:[ChatRoomService],
    controllers:[ChatRoomController],
    exports:[ChatRoomService,TypeOrmModule]
})
export class ChatRoomModule {}