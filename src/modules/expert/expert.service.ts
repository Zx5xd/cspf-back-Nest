import { Injectable } from '@nestjs/common';
import { expertDto as ExpertDTO } from '../../dto/expert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpertEntity } from './expert.entity';

@Injectable()
export class ExpertService {
  constructor(
    @InjectRepository(ExpertEntity)
    private readonly expertRepository: Repository<ExpertEntity>,
  ) {}

  async create(expertProp: any) {
    const expertDto: ExpertDTO = expertProp;

    const existingUser = await this.expertRepository.findOne({
      where: [{ username: expertDto.username }, { email: expertDto.email }],
    });
    if (existingUser) {
      return {
        success: false,
        message: '해당 아이디 또는 이메일은 사용 중 입니다.',
      };
    }
    const latestUsers = await this.expertRepository.find({
      order: { expertCode: 'DESC' },
      take: 1,
    });

    let expertCode: string;
    if (latestUsers.length === 0) {
      // 유저가 없는 경우, 초기 값으로 "U000000001" 설정
      console.log(expertProp.expertType[0]);
      expertCode = expertProp.expertType[0] + `${'1'.padStart(8, '0')}`;
    } else {
      // 유저가 있는 경우, 가장 마지막 userCode에서 숫자를 추출하여 +1
      const latestCode = parseInt(latestUsers[0].expertCode.slice(1)); // "U" 이후 숫자만 추출
      const newCode = latestCode + 1;
      expertCode = `${expertProp.expertType[0]}${newCode.toString().padStart(8, '0')}`;
    }

    const user = this.expertRepository.create({
      expertCode: expertCode,
      username: expertDto.username,
      password: expertDto.password,
      name: expertDto.name,
      company: expertDto.company,
      email: expertDto.email,
      phone: expertDto.phone,
      image: expertDto.image,
      certImage: expertDto.certImage
    });

    console.log('Repository create 완료', user);
    await this.expertRepository.save(user);

    return { success: true, message: '계정 생성 성공' };
  }

  findAll() {
    return this.expertRepository.find();
  }

  async expertList(type:string) {
    const test = await this.expertRepository
        .createQueryBuilder('expert')
        .where('expert.expertCode LIKE :type', { type: `${type}%` })
        .getMany();
    console.log(test)
    return test
  }

  async getExpertByUsername(username: string): Promise<ExpertEntity> {
    return await this.expertRepository.findOne({ where: { username }, relations: ['profile'] });
  }

  async findOne(username: string) {
    const existingUser = await this.expertRepository.findOne({
      where: [{ username: username }],
      relations: ['profile'],
    });

    if (existingUser) {
      return {
        success: false,
        message: '해당 아이디는 사용 중 입니다.',
        expertDto: existingUser,
      };
    } else {
      return {
        success: true,
        message: '이용 가능한 아이디입니다.',
      };
    }
  }

  async update(id: string, updateDto: Partial<ExpertEntity>) {
    const expert = await this.expertRepository.findOne({where: {expertCode: id}})

    const updatedExpert = { ...expert, ...updateDto };

    return this.expertRepository.save(updatedExpert);
  }

  delete(id: string) {
    return this.expertRepository.delete({ expertCode: id });
  }
}
