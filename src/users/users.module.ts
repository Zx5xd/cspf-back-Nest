import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { GoogleUserController } from './google-user/google-user.controller';
import { GoogleUserService } from './google-user/google-user.service';
import { GoogleUsersEntity } from './google-user/google-user.entity';
import { NaverUserService } from './naver-user/naver-user.service';
import { NaverUser } from './naver-user/entities/naver-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GoogleUsersEntity, NaverUser]),
  ], // User 엔티티를 리포지토리로 등록
  providers: [UsersService, GoogleUserService, NaverUserService],
  controllers: [UsersController],
  exports: [UsersService, GoogleUserService, NaverUserService],
})
export class UsersModule {}
