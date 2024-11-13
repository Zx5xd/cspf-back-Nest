import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatImageEntity, ImageEntity} from "./image.entity";
import {ImageService} from "@/modules/image/image.service";
import {ImageController} from "@/modules/image/image.controller";
import {ChatRoomModule} from "@/modules/chatroom/chatroom.module";
import {ChatModule} from "@/modules/chat/chat.module";
import {ChatLogModule} from "@/modules/chatlog/chatlog.module";
import {ExpertModule} from "@/modules/expert/expert.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([ChatImageEntity, ImageEntity]),
        ChatRoomModule,
        ChatLogModule,
        ChatModule,
        ExpertModule
    ],
    providers:[ImageService],
    controllers:[ImageController],
    exports:[ImageService]
})
export class ImageModule {}