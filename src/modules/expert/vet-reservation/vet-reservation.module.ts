import { Module } from '@nestjs/common';
import { VetReservationService } from './vet-reservation.service';
import { VetReservationController } from './vet-reservation.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LawyerchatEntity} from "@/modules/expert/lawyerchat/lawyerchat.entity";
import {VetReservationEntity} from "@/modules/expert/vet-reservation/vet-reservation.entity";
import {SseModule} from "@/utils/sse/sse.module";

@Module({
  imports: [TypeOrmModule.forFeature([VetReservationEntity]),
  SseModule],
  controllers: [VetReservationController],
  providers: [VetReservationService],
})
export class VetReservationModule {}
