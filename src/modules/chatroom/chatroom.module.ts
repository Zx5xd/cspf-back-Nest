import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatRoomEntity } from "./chatroom.entity";
import { ChatRoomController } from "./chatroom.controller";
import { ChatRoomService } from "./chatroom.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([ChatRoomEntity])
    ],
    providers:[ChatRoomService],
    controllers:[ChatRoomController],
    exports:[ChatRoomService]
})
export class ChatRoomModule {}