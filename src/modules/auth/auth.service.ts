import {Injectable, UnauthorizedException} from "@nestjs/common";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as process from "process";
import {LoginDTO} from "../../dto/user.dto";
import * as bcrypt from 'bcrypt';
import {AdminService} from "../admin/admin.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly adminService: AdminService,
        private readonly jwtService: JwtService,
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

    async validateAdmin(username: string, password: string): Promise<any> {
        const user = await this.adminService.getUserById(username);
        if (!user) {
            throw new UnauthorizedException();
        }
        if (user && user.password === password) {  // 비밀번호 비교는 해싱을 사용하는 것이 좋습니다.
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    token(payload:any,expiresIn:string) {
        return this.jwtService.sign(payload,{
            secret: process.env.SECRET_KEY,
            expiresIn: expiresIn
        })
    }

    async login(loginDto: LoginDTO) {
        const user = await this.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.username, sub: user.userCode };

        const accessToken = this.token(payload,'15m')
        const refreshToken = this.token(payload, '7d')

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userService.updateRefreshToken(user.userCode,hashedRefreshToken)

        return {
            accessToken,
            refreshToken
        };
    }

    async loginAdmin(loginDto: LoginDTO) {
        const user = await this.validateAdmin(loginDto.username, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { username: user.username, sub: user.userCode, role: 'admin' };

        const accessToken = this.token(payload,'15m')
        const refreshToken = this.token(payload, '7d')

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.adminService.updateRefreshToken(user.userCode,hashedRefreshToken)

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

    async refreshAdminTokens(refreshToken: string, username: string) {
        const user = await this.adminService.getUserById(username);

        if (!user || !user.refreshToken) {
            throw new Error('Refresh token not found');
        }

        const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshToken);

        if (!isRefreshTokenMatching) {
            throw new Error('Invalid refresh token');
        }

        const payload = { username: user.username, sub: user.adminCode };
        const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        // 새 리프레시 토큰을 DB에 저장
        const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
        await this.adminService.updateRefreshToken(user.adminCode, hashedNewRefreshToken);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

    async removeRefreshToken(userCode: string) {
        await this.userService.updateRefreshToken(userCode, null);
    }

    async removeOtherRefreshToken(userCode: string,type:'admin') {
        if (type==='admin') {
            await this.adminService.updateRefreshToken(userCode, null);
        }
    }
    
}