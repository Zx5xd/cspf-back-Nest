import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatLogEntity } from "./chatlog.entity";
import { ChatLogService } from "./chatlog.service";
import { ChatLogController } from "./chatlog.controller";

@Module({
  imports:[
    TypeOrmModule.forFeature([ChatLogEntity]),
  ],
  providers: [ChatLogService],
  controllers: [ChatLogController],
  exports: [ChatLogService]
})
export class ChatLogModule {}