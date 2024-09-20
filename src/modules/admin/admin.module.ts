import {Module} from "@nestjs/common";
import {AdminService} from "./admin.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AdminEntity} from "./admin.entity";
import {AdminController} from "./admin.controller";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

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