import { Injectable } from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {LawyerchatEntity} from "@/modules/expert/lawyerchat/lawyerchat.entity";
import {createLawyerChatDto, LawyerchatDto, updateStatusDto} from "@/dto/lawyerchat.dto";
import {CronJob} from 'cron'
import {SchedulerRegistry} from "@nestjs/schedule";
import {ChatRoomService} from "@/modules/chatroom/chatroom.service";
import {accessUsers} from "@/types/chatroomTypes";
import {LawyerchatController} from "@/modules/expert/lawyerchat/lawyerchat.controller";
import {SseService} from "@/utils/sse/sse.service";

@Injectable()
export class LawyerchatService {
  constructor(
      @InjectRepository(LawyerchatEntity)
      private readonly lawyerchatRepository: Repository<LawyerchatEntity>,
      private readonly schedulerRegistry: SchedulerRegistry,
      private readonly chatRoomService: ChatRoomService,
      private readonly sseService: SseService,
  ) {
  }

  async create(createLawyerchatDto: createLawyerChatDto) {

    const existingReqChat = await this.lawyerchatRepository.find({
      where: {
        lawyerCode: {expertCode: createLawyerchatDto.lawyerCode},
        ownerCode: {userCode: createLawyerchatDto.ownerCode}
      }
    })

    if(existingReqChat.some(statusNumber => statusNumber.reqStatus <9)){
      if(existingReqChat.some(data => data.reqDate === createLawyerchatDto.reqDate)) {
        return {
          success: false,
          message: `Lawyer chats already exists`,
        }
      }
    }
    // console.log(existingReqChat.length);

    const createReq = {
      lawyerCode: {expertCode: createLawyerchatDto.lawyerCode},
      ownerCode: {userCode: createLawyerchatDto.ownerCode},
      reqDate: createLawyerchatDto.reqDate,
      prefTime: createLawyerchatDto.prefTime,
      description: createLawyerchatDto.description,
    }

    const result = this.lawyerchatRepository.create(createReq)
    console.log('result', result)
    await this.lawyerchatRepository.save(result)

    this.sseService.sendEventToUser(createLawyerchatDto.lawyerCode, {
      type: 'request',
      data: JSON.stringify({
        messsage: `상담 요청이 왔습니다.`
      }),
    })

    return {
      success: true,
      message: '상담 신청이 완료되었습니다.'
    };

  }

  async scheduleReservation(savedReservation: LawyerchatDto) {
    const [hours, minutes] = savedReservation.prefTime.split(':').map(Number);
    const [year, month, day] = savedReservation.reqDate.toString().split('-').map(Number);
    const jobDate = new Date(year, month - 1, day, hours, minutes);
    console.log(jobDate.toISOString());

    const job = new CronJob(jobDate, () => {
      const accessUser:accessUsers = {
        owner:savedReservation.ownerCode,
        access:[savedReservation.ownerCode,savedReservation.lawyerCode],
        invite:[]
      }

      this.chatRoomService.create({accessUser:accessUser}).then((data)=>{
        this.updateStatus(savedReservation.lawChatReqId, {
          lawyerCode: savedReservation.lawyerCode,
          reqStatus: 2
        })
      })
    });

    this.schedulerRegistry.addCronJob(`reservation_${savedReservation.lawyerCode}_${savedReservation.reqDate}`, job);
    job.start();
  }

  async findAll(userCode: string) {
    if(userCode.charAt(0) === 'L'){
      this.sseService.sendEventToUser(userCode,{
        type: 'lawyerList',
        data: {
          messsage: "변호사 채팅 리스트",
        },
      })

      return await this.lawyerchatRepository.find({
        where: {lawyerCode: {expertCode: userCode}},
        relations: ['ownerCode'],
        select: {ownerCode: {name: true}}
      })


    }else{
      return {
        success: false,
        message: 'Server Error, Code...'
      }
    }

  }

  async lawyerCount(userCode: string) {
    return await this.lawyerchatRepository.count({where: {lawyerCode: {expertCode: userCode}, reqStatus: 0}})
  }

  async findOne(id: number, userCode: string) {
    return await this.lawyerchatRepository.findOne({where: {lawChatReqId: id, lawyerCode: {expertCode: userCode}}, relations:['ownerCode']})
  }

  async commitChat(id: number, userCode: string) {
    const reqChatInfo = await this.findOne(id, userCode);

    this.updateStatus(id, {
      lawyerCode: userCode,
      reqStatus: 1
    })
    console.log(reqChatInfo, userCode)
    const reqChat: LawyerchatDto = {
      lawChatReqId: reqChatInfo.lawChatReqId,
      lawyerCode: userCode,
      reqDate: reqChatInfo.reqDate,
      prefTime: reqChatInfo.prefTime,
      reqStatus: reqChatInfo.reqStatus,
      ownerCode: reqChatInfo.ownerCode.userCode,
      description: reqChatInfo.description,
      createdAt: reqChatInfo.createdAt,
      cancelDate: reqChatInfo.cancelDate,
    }

    return await this.scheduleReservation(reqChat);
  }

  async updateStatus(id: number, denyDto: updateStatusDto) {
    let reqInfo = await this.findOne(id, denyDto.lawyerCode);
    reqInfo = { ...reqInfo, reqStatus: denyDto.reqStatus };

    return await this.lawyerchatRepository.save(reqInfo);
  }

  remove(id: number) {
    return `This action removes a #${id} lawyerchat`;
  }
}
