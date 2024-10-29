import {Injectable} from '@nestjs/common';
import {Repository, UpdateResult} from "typeorm";
import {UserEntity} from "./user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateUserDto, UpdateUserDTO} from "../../dto/user.dto";
import {ImageService} from "../image/image.service";
import {Buffer} from "buffer";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository:Repository<UserEntity>,
        private readonly imageService: ImageService
    ) {}

    async create(userDto:CreateUserDto, imgBuffer:Buffer) {
        const existingUser = await this.userRepository.findOne({where:[{username:userDto.username},{email:userDto.email}]})
        if (existingUser) {
            return { success: false, message: '해당 아이디 또는 이메일은 사용 중 입니다.' };
        }
        const latestUsers = await this.userRepository.find({order:{userCode:'DESC'},take:1});

        let userCode: string;
        if (latestUsers.length === 0) {
            // 유저가 없는 경우, 초기 값으로 "U000000001" 설정
            userCode = `U${'1'.padStart(8, '0')}`;
        } else {
            // 유저가 있는 경우, 가장 마지막 userCode에서 숫자를 추출하여 +1
            const latestCode = parseInt(latestUsers[0].userCode.slice(1)); // "U" 이후 숫자만 추출
            const newCode = latestCode + 1;
            userCode = `U${newCode.toString().padStart(8, '0')}`;
        }
        console.log('test')
        const user = await this.userRepository.create({...userDto,userCode,});
        await this.userRepository.save(user);
        if (imgBuffer != null) {
            user.profileImg = await this.imageService.saveProfileImage(imgBuffer, userCode);
            await this.userRepository.save(user);
        }

        return { success: true, message: '계정 생성 성공' };
    }

    async getUserById(username: string): Promise<UserEntity> {
        return await this.userRepository.findOne({ where: { username } });
    }

    async getAllUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async getProfile(userCode:string): Promise<UserEntity> {
        return await this.userRepository.findOne({
            where: {userCode:userCode},
            select: ['username','email','addr','phone','gender','nickname','name']
        })
    }

    async updateRefreshToken(userCode:string,refreshToken:string) {
        await this.userRepository.update(
            userCode,
            {refreshToken:refreshToken}
        )
    }

    async updateUser(userCode:string,userDto:UpdateUserDTO) {
        const result:UpdateResult = await this.userRepository.update(userCode, userDto)

        if (result.affected > 0) {
            return { success: true, message: '계정이 성공적으로 수정되었습니다' };
        } else {
            return { success: false, message: '계정이 존재하지 않거나 수정할 수 없어 실패했습니다' };
        }
    }

    async deleteUser(userCode:string) {
        const result = await this.userRepository.delete({userCode:userCode})

        if (result.affected > 0) {
            return { success: true, message: '계정이 성공적으로 삭제되었습니다' };
        } else {
            return { success: false, message: '계정이 존재하지 않거나 삭제할 수 없어 실패했습니다' };
        }
    }
}
