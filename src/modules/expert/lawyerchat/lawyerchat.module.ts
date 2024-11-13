import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LawyerchatEntity} from "@/modules/expert/lawyerchat/lawyerchat.entity";
import {ExpertModule} from "@/modules/expert/expert.module";
import {UserModule} from "@/modules/user/user.module";
import {LawyerchatController} from "@/modules/expert/lawyerchat/lawyerchat.controller";
import {LawyerchatService} from "@/modules/expert/lawyerchat/lawyerchat.service";
import {ScheduleModule} from "@nestjs/schedule";
import {ChatRoomModule} from "@/modules/chatroom/chatroom.module";

@Module({
  imports: [
      ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([LawyerchatEntity]),
      ExpertModule,
      UserModule,
      ChatRoomModule
  ],
  controllers: [LawyerchatController],
  providers: [LawyerchatService],
  exports: [LawyerchatService],
})
export class LawyerchatModule {}
