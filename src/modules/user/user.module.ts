import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import {UserEntity} from "@/modules/user/user.entity";
import {GoogleUsersEntity} from "@/modules/user/google-user/google-user.entity";
import {NaverUserEntity} from "@/modules/user/naver-user/naver-user.entity";
import {ImageModule} from "@/modules/image/image.module";
import {UserService} from "@/modules/user/user.service";
import {UserController} from "@/modules/user/user.controller";
import {GoogleUserService} from "@/modules/user/google-user/google-user.service";
import {NaverUserService} from "@/modules/user/naver-user/naver-user.service";
import {NaverStrategy} from "@/modules/user/naver-user/naver.strategy";
import {GoogleStrategy} from "@/modules/user/google-user/google.strategy";

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
