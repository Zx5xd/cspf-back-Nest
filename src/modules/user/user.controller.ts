import {Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards} from '@nestjs/common';
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import {CreateUserDto} from "../../dto/user.dto";
import {Response} from "express";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDTO: CreateUserDto) {
        return await this.userService.create(createUserDTO);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(@Req() req, @Res() res) {
        const user = await this.userService.getProfile(req.user.userCode)
        res.send(user)
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
