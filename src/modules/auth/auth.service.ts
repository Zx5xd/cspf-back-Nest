import {Injectable, UnauthorizedException} from "@nestjs/common";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as process from "process";
import {LoginDTO} from "../../dto/user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.getUserById(username);
        if (!user) {
            throw new UnauthorizedException();
        }
        if (user && user.password === password) {  // 비밀번호 비교는 해싱을 사용하는 것이 좋습니다.
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDTO) {
        const user = await this.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.username, sub: user.userCode };

        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.SECRET_KEY,
            expiresIn: '15m'
        });  // Access Token: 15분 유효
        const refreshToken = this.jwtService.sign(payload, {
          secret: process.env.SECRET_KEY,
          expiresIn: '7d'
        });  // Refresh Token: 7일 유효

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userService.updateRefreshToken(user.userCode,hashedRefreshToken)

        return {
            accessToken,
            refreshToken
        };
    }

    async refreshTokens(refreshToken: string, username: string) {
        const user = await this.userService.getUserById(username);

        if (!user || !user.refreshToken) {
            throw new Error('Refresh token not found');
        }

        const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshToken);

        if (!isRefreshTokenMatching) {
            throw new Error('Invalid refresh token');
        }

        const payload = { username: user.username, sub: user.userCode };
        const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        // 새 리프레시 토큰을 DB에 저장
        const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
        await this.userService.updateRefreshToken(user.userCode, hashedNewRefreshToken);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

    async removeRefreshToken(userCode: string) {
        await this.userService.updateRefreshToken(userCode, null);
    }
    
}