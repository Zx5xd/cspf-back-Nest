import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {UserEntity} from "./user.entity";
import {ImageModule} from "../image/image.module";
import {GoogleUserService} from "./google-user/google-user.service";
import {NaverUserService} from "./naver-user/naver-user.service";
import {NaverStrategy} from "./naver-user/naver.strategy";
import {GoogleStrategy} from "./google-user/google.strategy";
import {GoogleUsersEntity} from "./google-user/google-user.entity";
import {NaverUserEntity} from "./naver-user/naver-user.entity";

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity, GoogleUsersEntity, NaverUserEntity]),
    ImageModule
  ],
  providers: [UserService, GoogleUserService, NaverUserService, NaverStrategy, GoogleStrategy],
  controllers: [UserController],
  exports: [UserService, GoogleUserService, NaverUserService, NaverStrategy, GoogleStrategy],
})
export class UserModule {}
