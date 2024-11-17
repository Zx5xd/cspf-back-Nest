import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {ExpertProfileEntity} from "@/modules/expert/expertProfile.entity";
import {ExpertEntity} from "@/modules/expert/expert.entity";
import {ExpertProfileDto} from "@/dto/expertProfile.dto";

@Injectable()
export class ExpertProfileService {
  constructor(
    @InjectRepository(ExpertProfileEntity)
    private readonly expertProfileRepository: Repository<ExpertProfileEntity>,
    @InjectRepository(ExpertEntity)
    private readonly expertRepository: Repository<ExpertEntity>,
  ) {}

  async create(createExpertProp: any) {
    // console.log('createExpertProp', createExpertProp);
    const { expertCode: expert, ...profileInputData } = createExpertProp;

    // console.log('profileInputData, ', profileInputData);

    const profile_yn = await this.expertRepository.findOne({
      where: {expertCode: expert},
      relations: ['profile'],
    });
    // console.log(`profile_yn`+ JSON.stringify(profile_yn));
    if (profile_yn.profile) {
      this.update(profile_yn.profile.id, profileInputData);
    } else {
      const expertProfileDto: ExpertProfileDto = profileInputData;
      expertProfileDto.id = expert+'_public';
      // console.log(expertProfileDto);
      const profile = this.expertProfileRepository.create(expertProfileDto);
      await this.expertProfileRepository.save(profile);
      await this.expertRepository.update({expertCode: expert}, {
        profile: profile,
      });
      return { success: true, message: '프로필 생성 성공' };
    }
  }

  findAll() {
    return this.expertProfileRepository.find();
  }

  async findOne(id: string) {
    const result = await this.expertProfileRepository.findOne({
      where: [{ id: id }],
    });

    if (result) {
      return {
        success: true,
        expertProfile: result,
      };
    } else {
      return {
        success: false,
      };
    }

    // return
  }

  update(id: string, updateDto: ExpertProfileEntity) {
    console.log(`update ${id} ${JSON.stringify(updateDto)}`);
    return this.expertProfileRepository.update(id, updateDto);
  }
}
