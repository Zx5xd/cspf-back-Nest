import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {UserEntity} from "./user.entity";
import {ImageModule} from "../image/image.module";

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity]),
    ImageModule
  ],
  providers: [UserService,],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
