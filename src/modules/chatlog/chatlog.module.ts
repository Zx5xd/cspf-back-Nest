import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {ChatLogEntity} from "@/modules/chatlog/chatlog.entity";
import {AdminModule} from "@/modules/admin/admin.module";
import {ChatLogService} from "@/modules/chatlog/chatlog.service";
import {ChatLogController} from "@/modules/chatlog/chatlog.controller";

@Module({
  imports:[
      TypeOrmModule.forFeature([ChatLogEntity]),
      AdminModule
  ],
  providers: [ChatLogService],
  controllers: [ChatLogController],
  exports: [ChatLogService]
})
export class ChatLogModule {}