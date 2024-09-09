import { Injectable } from '@nestjs/common';
import {Repository} from "typeorm";
import {UserEntity} from "./user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateUserDto} from "../../dto/user.dto";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository:Repository<UserEntity>
    ) {}

    async create(userDto:CreateUserDto) {

    }

    async getUserById(username: string): Promise<UserEntity> {
        return await this.userRepository.findOne({ where: { username } });
    }

    async getAllUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }
}
