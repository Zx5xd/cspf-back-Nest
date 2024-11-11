import {
    Body,
    Controller,
    Delete,
    Get,
    NestInterceptor,
    Param,
    Post,
    Put,
    Req,
    Res, UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import {CreateUserDto, UpdateUserDTO} from "../../dto/user.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {Buffer} from "buffer";

@Controller('user')
export class UserController {
    constructor(
      private readonly userService: UserService
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('img') as unknown as NestInterceptor)
    async create(@Body() createUserDTO: CreateUserDto,
                 @UploadedFile() profileImage?: Express.Multer.File) {
        return await this.userService.create(createUserDTO, profileImage.buffer as Buffer);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(@Req() req) {
        return await this.userService.getProfile(req.user.userCode)
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
