import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ExpertEntity} from "@/modules/expert/expert.entity";
import {ExpertProfileEntity} from "@/modules/expert/expertProfile.entity";
import {ExpertProfileController} from "@/modules/expert/expertProfile.controller";
import {ExpertProfileService} from "@/modules/expert/expertProfile.service";
import {ExpertService} from "@/modules/expert/expert.service";
import {ExpertController} from "@/modules/expert/expert.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ExpertEntity, ExpertProfileEntity])],
  controllers: [ExpertController, ExpertProfileController],
  providers: [ExpertService, ExpertProfileService],
  exports: [ExpertService, ExpertProfileService, TypeOrmModule],
})
export class ExpertModule {}
