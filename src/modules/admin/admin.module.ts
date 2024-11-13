import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AdminEntity} from "@/modules/admin/admin.entity";
import {AdminController} from "@/modules/admin/admin.controller";
import {AdminService} from "@/modules/admin/admin.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([AdminEntity]),
        JwtModule.registerAsync({
            imports: [ConfigModule], // ConfigModule을 import하여 사용할 수 있도록 설정
            inject: [ConfigService],  // ConfigService를 주입
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('SECRET_KEY'),  // 환경 변수에서 SECRET_KEY 가져옴
                signOptions: { expiresIn: '15m' },  // JWT 토큰 만료 시간 설정
            }),
        }),
    ],
    controllers:[AdminController],
    providers:[AdminService],
    exports:[AdminService]
})
export class AdminModule {}