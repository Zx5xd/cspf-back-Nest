import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PetService} from "@/modules/pet/pet.service";
import {createInsuereChatDto, updateStatusDto, InsurerListDto} from "@/dto/insurerchat.dto";
import {InsurerchatEntity} from "@/modules/expert/insurerchat/insurerchat.entity";
import {accessUsers} from "@/types/chatroomTypes";
import {ChatRoomService} from "@/modules/chatroom/chatroom.service";
import {SseService} from "@/utils/sse/sse.service";

@Injectable()
export class InsurerchatService {
  constructor(
      @InjectRepository(InsurerchatEntity)
      private readonly insurerchatEntityRepository: Repository<InsurerchatEntity>,
      private readonly petServece:PetService,
      private readonly chatRoomService: ChatRoomService,
      private readonly sseService: SseService,
  ) {
  }

  async create(createInsurerchatDto: createInsuereChatDto, userCode:string) {
    // const existingReqChat = await this.insurerchatEntityRepository.find({
    //   where: {
    //     insurerId: {expertCode: createInsurerchatDto.insurerId},
    //     owner: {userCode: createInsurerchatDto.owner}
    //   }
    // })

    // if (existingReqChat.some(data => data. === createInsurerchatDto.reqDate)) {
    //   return {
    //     success: false,
    //     message: `Lawyer chats already exists`,
    //   }
    // }
    // console.log(existingReqChat.length);

    const createReq = {
      insurerId: {expertCode: createInsurerchatDto.insurerId},
      owner: {userCode: userCode},
      pet: {dogRegNo: createInsurerchatDto.pet}
    }

    const result = this.insurerchatEntityRepository.create(createReq)
    console.log('result', result)
    await this.insurerchatEntityRepository.save(result)

    this.sseService.sendEventToUser(createInsurerchatDto.insurerId,{
      type:"request",
      data:{
        id:result.insChatReqNumber,
        message:"상담 요청이 들어왔습니다"
      }
    })

    return {
      success: true,
      message: '상담 신청이 완료되었습니다.'
    };
  }

  async findAll(userCode: string) {
    return await this.insurerchatEntityRepository.find({
      where: {insurerId: {expertCode: userCode}},
      relations: ['owner', 'pet'],
      select:{
        owner:{
          name:true
        },
        pet:{
          kindNm: true,
          Birthday: true
        }}
    });
  }

  async findOne(id: number) {
    return await this.insurerchatEntityRepository.findOne({
      where: {insChatReqNumber: id}, relations:['owner']
    })
  }

  async updateStatus(id: number, updateStatusDto: updateStatusDto) {
    let reqInfo = await this.findOne(id);
    reqInfo = {...reqInfo, reqStatus: updateStatusDto.reqStatus};

    return await this.insurerchatEntityRepository.save(reqInfo);
  }

  remove(id: number) {
    return `This action removes a #${id} insurerchat`;
  }

  async insurerCnt(userCode) {
    return await this.insurerchatEntityRepository.count({where: {insurerId: {expertCode: userCode}, reqStatus: 0}})
  }

  async commitChat(id: number, userCode: string) {
    const reqChatInfo = await this.findOne(id);

    this.updateStatus(id,{
      reqStatus: 1
    })

    const accessUser: accessUsers = {
      owner: reqChatInfo.owner.userCode,
      access: [reqChatInfo.owner.userCode, userCode],
      invite: []
    }

    return this.chatRoomService.create({accessUser:accessUser}) ;
  }
}
