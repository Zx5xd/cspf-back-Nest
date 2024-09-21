import {Body, Controller, Get, Param, Post, Req, Request, Res, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {LoginDTO} from "../../dto/user.dto";
import {Response} from "express";
import process from "process";
import {JwtStrategy} from "./jwt.strategy";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {JwtAuthGuard} from "./jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    @Post('login')
    async login(@Body() loginDTO:LoginDTO, @Res({passthrough: true}) res: Response) {
        const { accessToken, refreshToken } = await this.authService.login(loginDTO);
        const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

        res.cookie('authorization', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
        });
        res.send({ message: 'Logged in successfully' });
    }

    @Post('login/:type')
    async loginOther(@Param('type') type:string,@Body() loginDTO:LoginDTO, @Res({passthrough: true}) res: Response) {
        if (type==='admin') {
            const { accessToken, refreshToken } = await this.authService.loginAdmin(loginDTO);
            const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

            res.cookie('authorization', accessToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'strict',
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'strict',
            });
            res.send({ message: 'Logged in successfully' });
        } else {
            res.status(404).send({message:'Invalid type'})
        }
    }

    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string, @Req() req, @Res() res) {
        try {
            const payload = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_SECRET_KEY });

            const userId = payload.sub;  // 사용자 ID 추출
            const newTokens = await this.authService.refreshTokens(refreshToken, userId);

            // 새로운 accessToken과 refreshToken을 쿠키에 저장
            res.cookie('authorization', newTokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });

            res.cookie('refreshToken', newTokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.send({ message: 'Access token refreshed successfully' });
        } catch (error) {
            res.status(401).send({ message: 'Invalid refresh token' });
        }
    }

    @Post('refresh/:type')
    async refreshOther(@Param('type') type:'admin',@Body('refreshToken') refreshToken: string, @Req() req, @Res() res) {
        try {
            if (type==='admin') {
                const payload = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_SECRET_KEY });

                const userId = payload.sub;  // 사용자 ID 추출
                const newTokens = await this.authService.refreshAdminTokens(refreshToken, userId);

                // 새로운 accessToken과 refreshToken을 쿠키에 저장
                res.cookie('authorization', newTokens.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                });

                res.cookie('refreshToken', newTokens.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                });
                res.send({ message: 'Access token refreshed successfully' });
            }
        } catch (error) {
            res.status(401).send({ message: 'Invalid refresh token' });
        }
    }

    @Post('logout')
    async logout(@Req() req:any, @Res() res) {
        const refreshToken = req.cookies['refreshToken'];  // 클라이언트의 쿠키에서 refreshToken 가져오기
        if (refreshToken) {
            await this.authService.removeRefreshToken(refreshToken);  // 서버에서 refreshToken 무효화
        }

        // 쿠키에서 accessToken과 refreshToken 삭제
        res.clearCookie('authorization');  // accessToken 삭제
        res.clearCookie('refreshToken');  // refreshToken 삭제

        return res.send({ message: 'Logged out successfully' });
    }

    @Post('logout/:type')
    async logoutOther(@Param('type') type:'admin',@Req() req:any, @Res() res) {
        if (type==='admin') {
            const refreshToken = req.cookies['refreshToken'];  // 클라이언트의 쿠키에서 refreshToken 가져오기
            if (refreshToken) {
                await this.authService.removeRefreshToken(refreshToken);  // 서버에서 refreshToken 무효화
            }

            // 쿠키에서 accessToken과 refreshToken 삭제
            res.clearCookie('authorization');  // accessToken 삭제
            res.clearCookie('refreshToken');  // refreshToken 삭제

            res.send({ message: 'Logged out successfully' });
        } else {
            res.status(401).send({ message: 'Logged out failed' });
        }
    }
}