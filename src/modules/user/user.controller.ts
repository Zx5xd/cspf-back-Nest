import {Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards} from '@nestjs/common';
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import {CreateUserDto, UpdateUserDTO} from "../../dto/user.dto";
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

    @UseGuards(JwtAuthGuard)
    @Put()
    async updateUser(@Req() req,@Body() userDto:UpdateUserDTO) {
        return await this.userService.updateUser(req.user.userCode,userDto)
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteUser(@Req() req) {
        return await this.userService.deleteUser(req.user.userCode)
    }
}
