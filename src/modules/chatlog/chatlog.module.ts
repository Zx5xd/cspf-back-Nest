import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatLogEntity } from "./chatlog.entity";
import { ChatLogService } from "./chatlog.service";
import { ChatLogController } from "./chatlog.controller";
import {AdminModule} from "../admin/admin.module";

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