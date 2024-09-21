import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {AdminEntity} from "./admin.entity";
import {Repository} from "typeorm";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminEntity)
        private readonly adminRepository:Repository<AdminEntity>
    ) {}

    async getUserById(username:string) {
        return this.adminRepository.findOne({where:{username:username}})
    }

    async findOne(adminCode:string,username:string) {
        return this.adminRepository.findOne({where:{adminCode:adminCode,username:username}})
    }

    async updateRefreshToken(adminCode:string,refreshToken:string) {
        await this.adminRepository.update(
            {adminCode:adminCode},
            {refreshToken:refreshToken}
        )
    }
}