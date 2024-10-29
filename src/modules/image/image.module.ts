import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatImageEntity, ImageEntity} from "./image.entity";
import {ImageService} from "./image.service";
import {ImageController} from "./image.controller";
import {ChatRoomModule} from "../chatroom/chatroom.module";
import {ChatModule} from "../chat/chat.module";
import {ChatLogModule} from "../chatlog/chatlog.module";
import {ExpertModule} from "../expert/expert.module";

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