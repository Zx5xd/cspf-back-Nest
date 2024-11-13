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
import {FileInterceptor} from "@nestjs/platform-express";
import {Buffer} from "buffer";
import {UserService} from "@/modules/user/user.service";
import {JwtAuthGuard} from "@/modules/auth/jwt-auth.guard";
import {CreateUserDto, UpdateUserDTO} from "@/dto/user.dto";
import {UserEntity} from "@/modules/user/user.entity";

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
