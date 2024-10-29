import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {JwtModule} from "@nestjs/jwt";
import {UserModule} from "../user/user.module";
import {JwtStrategy} from "./jwt.strategy";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AdminModule} from "../admin/admin.module";
import {ExpertModule} from "../expert/expert.module";

@Module({
    imports:[
        // JwtModule.register({
        //     secret:process.env.SECRET_KEY,
        //     signOptions: {expiresIn:'15m'}
        // }),
        ConfigModule.forRoot({
            isGlobal: true, // 전역으로 설정하여 어디서든 환경 변수 사용 가능
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule], // ConfigModule을 import하여 사용할 수 있도록 설정
            inject: [ConfigService],  // ConfigService를 주입
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('SECRET_KEY'),  // 환경 변수에서 SECRET_KEY 가져옴
                signOptions: { expiresIn: '15m' },  // JWT 토큰 만료 시간 설정
            }),
        }),
        UserModule,
        ExpertModule,
        AdminModule
    ],
    providers:[AuthService, JwtStrategy],
    controllers:[AuthController],
    exports:[AuthService,JwtModule]
})
export class AuthModule {}