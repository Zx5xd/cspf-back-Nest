import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleUsersEntity } from './google-user.entity';

@Injectable()
export class GoogleUserService {
  constructor(
    @InjectRepository(GoogleUsersEntity)
    private readonly usersRepository: Repository<GoogleUsersEntity>,
  ) {
    this.usersRepository = usersRepository;
  }

  async findOrCreate(
    user: Partial<GoogleUsersEntity>,
  ): Promise<GoogleUsersEntity> {
    let foundUser = await this.usersRepository.findOne({
      where: { providerId: user.providerId },
    });
    if (!foundUser) {
      foundUser = this.usersRepository.create(user);
      await this.usersRepository.save(foundUser);
    }
    return foundUser;
  }
}
