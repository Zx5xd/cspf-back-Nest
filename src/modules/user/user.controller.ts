import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':username')
    async getUser(@Param('username') username: string): Promise<UserEntity> {
        return await this.userService.getUserById(username);
    }

    @Get()
    async getAllUsers(): Promise<UserEntity[]> {
        return await this.userService.getAllUsers();
    }
}
