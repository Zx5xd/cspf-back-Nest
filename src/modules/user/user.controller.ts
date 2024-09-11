import {Body, Controller, Delete, Get, Param, Post, Res} from '@nestjs/common';
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import {CreateUserDto} from "../../dto/user.dto";
import {Response} from "express";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDTO: CreateUserDto) {
        return await this.userService.create(createUserDTO);
    }

    @Get(':username')
    async getUser(@Param('username') username: string): Promise<UserEntity> {
        return await this.userService.getUserById(username);
    }

    @Get()
    async getAllUsers(): Promise<UserEntity[]> {
        return await this.userService.getAllUsers();
    }

    @Delete()
    async deleteUser() {

    }
}
