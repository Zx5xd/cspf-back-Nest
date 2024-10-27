import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NaverUser } from './naver-user.entity';

@Injectable()
export class NaverUserService {
  constructor(
    @InjectRepository(NaverUser)
    private readonly usersRepository: Repository<NaverUser>,
  ) {
    this.usersRepository = usersRepository;
  }

  async findOrCreate(user: Partial<NaverUser>): Promise<NaverUser> {
    let foundUser = await this.usersRepository.findOne({
      where: { naverId: user.naverId },
    });
    if (!foundUser) {
      foundUser = this.usersRepository.create(user);
      await this.usersRepository.save(foundUser);
    }
    return foundUser;
  }

  // create(createNaverUserDto: CreateNaverUserDto) {
  //   return 'This action adds a new naverUser';
  // }
  //
  // findAll() {
  //   return `This action returns all naverUser`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} naverUser`;
  // }
  //
  // update(id: number, updateNaverUserDto: UpdateNaverUserDto) {
  //   return `This action updates a #${id} naverUser`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} naverUser`;
  // }
}
