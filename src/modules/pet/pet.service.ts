import { Injectable } from '@nestjs/common';
import { petDto } from '../../dto/pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetEntity } from './pet.entity';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(PetEntity)
    private readonly petRepository: Repository<PetEntity>,
  ) {}

  async create(createPetDto: petDto) {
    const regInfo = await this.petRepository.findOne({
      where: { dogRegNo: createPetDto.dogRegNo },
    });

    console.log(`regInfo`, regInfo);

    if (regInfo) {
      return {
        message: '이미 등록된 등록증입니다.',
        success: false,
      };
    }

    const regPet = await this.petRepository.create(createPetDto);
    console.log(`regPet`, regPet);
    await this.petRepository.save(regPet);

    return {
      message: '등록이 완료되었습니다.',
      success: true,
    };
  }

  // findAll() {
  //   return `This action returns all pet`;
  // }

  async findOne(dogRegNo: string) {
    return await this.petRepository.findOne({
      where: { dogRegNo: dogRegNo },
    });
  }

  // async findOneToUser(userCode: string) {
  //   return await this.petRepository.findOne({
  //     where: { owner: userCode },
  //   });
  // }

  // update(id: number, updatePetDto: petDto) {
  //   return `This action updates a #${id} pet`;
  // }

  async remove(dogRegNo: string) {
    return await this.petRepository.findOne({
      where: { dogRegNo: dogRegNo },
    });
  }
}
