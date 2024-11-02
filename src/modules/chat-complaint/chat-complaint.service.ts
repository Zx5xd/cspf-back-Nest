import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatComplaintEntity } from './chatcomp.entity';
import { chatComplaintDto } from '../../dto/chatComplaint.dto';
import { ExpertEntity } from '../expert/expert.entity';
import { MailService } from '../../utils/mail/mail.service';

@Injectable()
export class ChatComplaintService {
  constructor(
    @InjectRepository(ChatComplaintEntity)
    private readonly chatCompRepository: Repository<ChatComplaintEntity>,
    @InjectRepository(ExpertEntity)
    private readonly expertRepository: Repository<ExpertEntity>,
    private readonly mailService: MailService,
  ) {}

  complaintReceive(compDto: chatComplaintDto) {
    return this.chatCompRepository.save(compDto);
  }

  getComplaintById(id: number) {
    return this.chatCompRepository.findOne({
      where: { id },
    });
  }

  getAllComplaint() {
    return this.chatCompRepository.find();
  }

  getComplaintList() {
    return this.chatCompRepository.find({ where: { processingStatus: 0 } });
  }

  async processComplaintById(id: number, processCode: number) {
    const comp = await this.chatCompRepository.findOne({
      where: { id },
    });

    if (comp.processingStatus === 1) {
      return null;
    }

    if (processCode == 1) {
      // 가해자 userCode 흭득
      const perpetrator = comp.perpetrator;
      const userRole = perpetrator.charAt(0);

      // 가해자 warnCount 작업
      if (userRole == 'U') {
        // userProfile 변경
      } else {
        // expertProfile 변경
        const perExpert = await this.expertRepository.findOne({
          where: { expertCode: perpetrator },
        });

        perExpert.warnCount >= 3
          ? (await this.mailService.sendWarningSanction({
              email: perExpert.email,
              name: perExpert.name,
              userCode: perExpert.expertCode,
            }),
            await this.expertRepository.delete(perExpert.expertCode))
          : await this.expertRepository.save({
              ...perExpert,
              warnCount: perExpert.warnCount + 1,
            });
      }
    }

    // 처리상태 업데이트
    return this.chatCompRepository.save({
      ...comp,
      processingStatus: processCode,
    });
  }
}
