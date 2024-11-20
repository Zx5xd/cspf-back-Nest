import {forwardRef, Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {ChatLogEntity} from "@/modules/chatlog/chatlog.entity";
import {AdminModule} from "@/modules/admin/admin.module";
import {ChatLogService} from "@/modules/chatlog/chatlog.service";
import {ChatLogController} from "@/modules/chatlog/chatlog.controller";
import {ChatRoomModule} from "@/modules/chatroom/chatroom.module";
import {UserModule} from "@/modules/user/user.module";
import {ExpertModule} from "@/modules/expert/expert.module";

@Module({
  imports:[
      TypeOrmModule.forFeature([ChatLogEntity]),
      AdminModule,
      ChatRoomModule,
      forwardRef(() => UserModule),
      forwardRef(() => ExpertModule),
  ],
  providers: [ChatLogService],
  controllers: [ChatLogController],
  exports: [ChatLogService]
})
export class ChatLogModule {}