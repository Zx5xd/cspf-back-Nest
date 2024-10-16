import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {GoogleUsersEntity} from "../users/google-user/google-user.entity";
import {NaverUser} from "../users/naver-user/entities/naver-user.entity";
import {PetEntity} from "./entities/pet.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([PetEntity]),
  ],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService]
})
export class PetModule {}
