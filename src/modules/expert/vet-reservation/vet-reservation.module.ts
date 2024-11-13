import { Module } from '@nestjs/common';
import { VetReservationService } from './vet-reservation.service';
import { VetReservationController } from './vet-reservation.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LawyerchatEntity} from "@/modules/expert/lawyerchat/lawyerchat.entity";
import {VetReservationEntity} from "@/modules/expert/vet-reservation/vet-reservation.entity";

@Module({
  imports: [TypeOrmModule.forFeature([VetReservationEntity])],
  controllers: [VetReservationController],
  providers: [VetReservationService],
})
export class VetReservationModule {}
