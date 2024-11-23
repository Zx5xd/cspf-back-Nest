import { Injectable } from '@nestjs/common';
import {createVetReservDto, updateStatusDto} from '@/dto/vetReservation.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {VetReservationEntity} from "@/modules/expert/vet-reservation/vet-reservation.entity";
import {Repository} from "typeorm";
import {SseService} from "@/utils/sse/sse.service";

@Injectable()
export class VetReservationService {

  constructor(
      @InjectRepository(VetReservationEntity)
      private readonly VetReservationEntityRepository: Repository<VetReservationEntity>,
      private readonly sseService: SseService,
  ) {
  }

  async create(createVetReservationDto: createVetReservDto, userCode: string) {
    const existingReqChat = await this.VetReservationEntityRepository.find({
      where: {
        hospId: {expertCode: createVetReservationDto.hospId},
        owner: {userCode: userCode}
      }
    })


    if (existingReqChat.some(data => data.resvDate === createVetReservationDto.resvDate)) {
      return {
        success: false,
        message: `Vet chats already exists`,
      }
    }
    // console.log(existingReqChat.length);

    const createReq = {
      hospId: {expertCode: createVetReservationDto.hospId},
      owner: {userCode: userCode},
      resvDate: createVetReservationDto.resvDate,
      prefTime: createVetReservationDto.prefTime,
      description: createVetReservationDto.description,
      pet:{dogRegNo: createVetReservationDto.pet}
    }

    const result = this.VetReservationEntityRepository.create(createReq)
    console.log('result', result)
    await this.VetReservationEntityRepository.save(result)

    return {
      success: true,
      message: '상담 신청이 완료되었습니다.'
    };
  }

  async findAll(userCode: string) {
    return await this.VetReservationEntityRepository.find({
      where: {
        hospId: {expertCode: userCode}
      },
      relations: ['owner','pet'],
      select:{
        owner:{
          name: true
        },
        pet:{
          kindNm: true,
          Birthday: true
        }
      }
    });
  }

  async findOne(id: number, userCode: string) {
    return await this.VetReservationEntityRepository.findOne({
      where: {hosReservationId: id, hospId: {expertCode: userCode}}
    });
  }

  async updateStatus(id: number, updateDto: updateStatusDto) {
    let resvInfo = await this.findOne(id, updateDto.hospId);
    resvInfo = {...resvInfo, resvStatus: updateDto.resvStatus};
    const resv = await this.VetReservationEntityRepository.save(resvInfo)
    if(updateDto.resvStatus === 1){
      this.sseService.sendEvent({
        type:'vetResv_success',
        data:JSON.stringify(`동물병원 예약 수락 완료하였습니다.`)
      })
    }
    return resv;
  }

  remove(id: number) {
    return `This action removes a #${id} vetReservation`;
  }
}
