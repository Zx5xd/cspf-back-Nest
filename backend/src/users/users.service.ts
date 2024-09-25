import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(UsersEntity)
      private readonly usersRepository: Repository<UsersEntity>,
  ) {
    this.usersRepository = usersRepository;
  }

  async findOrCreate(user: Partial<UsersEntity>): Promise<UsersEntity> {
    let foundUser = await this.usersRepository.findOne({
      where: { naverId: user.naverId },
    });
    if (!foundUser) {
      foundUser = this.usersRepository.create(user);
      await this.usersRepository.save(foundUser);
    }
    return foundUser;
  }
}
