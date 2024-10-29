import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {UserEntity} from "./user.entity";
import {GoogleUsersEntity} from "./google-user/google-user.entity";
import {NaverUserEntity} from "./naver-user/naver-user.entity";
import {GoogleUserService} from "./google-user/google-user.service";
import {NaverUserService} from "./naver-user/naver-user.service";
import {NaverStrategy} from "./naver-user/naver.strategy";
import {GoogleStrategy} from "./google-user/google.strategy";

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity, GoogleUsersEntity, NaverUserEntity]),
  ],
  providers: [UserService, GoogleUserService, NaverUserService, NaverStrategy, GoogleStrategy],
  controllers: [UserController],
  exports: [UserService, GoogleUserService, NaverUserService, NaverStrategy, GoogleStrategy]
})
export class UserModule {}
