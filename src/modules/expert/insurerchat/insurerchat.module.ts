import { Module } from '@nestjs/common';
import { InsurerchatService } from './insurerchat.service';
import { InsurerchatController } from './insurerchat.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatRoomModule} from "../../chatroom/chatroom.module";
import {ChatLogModule} from "../../chatlog/chatlog.module";
import {ChatModule} from "../../chat/chat.module";
import {ExpertModule} from "../expert.module";
import {InsurerchatEntity} from "./insurerchat.entity";
import {PetModule} from "@/modules/pet/pet.module";

@Module({
  imports:[
    TypeOrmModule.forFeature([InsurerchatEntity]),
    ExpertModule,
      PetModule,
      ChatRoomModule,
  ],
  controllers: [InsurerchatController],
  providers: [InsurerchatService],
  exports: [InsurerchatService]
})
export class InsurerchatModule {}
