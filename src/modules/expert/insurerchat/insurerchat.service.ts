import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PetService} from "@/modules/pet/pet.service";
import {createInsuereChatDto, updateStatusDto, InsurerListDto} from "@/dto/insurerchat.dto";
import {InsurerchatEntity} from "@/modules/expert/insurerchat/insurerchat.entity";
import {use} from "passport";
import {PetEntity} from "@/modules/pet/pet.entity";

@Injectable()
export class InsurerchatService {
  constructor(
      @InjectRepository(InsurerchatEntity)
      private readonly insurerchatEntityRepository: Repository<InsurerchatEntity>,
      private readonly petService: PetService,
  ) {
  }

  async create(createInsurerchatDto: createInsuereChatDto, userCode:string) {

    console.log('createInsurerchatDto', userCode)
    // const pet = await this.petService.findOneToUser(userCode)

    const createReq = {
      insurerId: {expertCode: createInsurerchatDto.insurerId},
      owner: {userCode: userCode},
      pet: {dogRegNo: createInsurerchatDto.pet}
    }

    const result = this.insurerchatEntityRepository.create(createReq)
    console.log('result', result)
    await this.insurerchatEntityRepository.save(result)

    return {
      success: true,
      message: '상담 신청이 완료되었습니다.'
    };
  }

  async findAll(userCode: string) {
    return await this.insurerchatEntityRepository.find({
      where: {insurerId: {expertCode: userCode}}
    });
  }

  async findOne(id: number, userCode: string) {
    return await this.insurerchatEntityRepository.findOne({
      where: {insChatReqNumber: id}
    });
  }

  async updateStatus(id: number, updateStatusDto: updateStatusDto) {
    let reqInfo = await this.findOne(id, updateStatusDto.insurerId);
    reqInfo = {...reqInfo, reqStatus: updateStatusDto.reqStatus};

    return await this.insurerchatEntityRepository.save(reqInfo);
  }

  remove(id: number) {
    return `This action removes a #${id} insurerchat`;
  }
}
