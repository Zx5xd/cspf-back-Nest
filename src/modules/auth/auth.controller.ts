import {Body, Controller, Get, Param, Post, Req, Request, Res, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {LoginDTO} from "../../dto/user.dto";
import {Request as ExpressRequest, Response} from "express";
import process from "process";
import {JwtStrategy} from "./jwt.strategy";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {AuthGuard} from "@nestjs/passport";
import {NaverUserService} from "../user/naver-user/naver-user.service";
import {GoogleUserService} from "../user/google-user/google-user.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly naverUserService: NaverUserService,
        private readonly googleUserService: GoogleUserService,
        private readonly configService: ConfigService,
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
        console.log(type, loginDTO)
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
        } else if(type==='expert'){
            const { accessToken, refreshToken } = await this.authService.loginExpert(loginDTO);
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
        else {
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

    // 마이그레이션
    // 구글 로그인 URL
    @Get('google')
    @UseGuards(AuthGuard('google')) // Google 전략 사용
    async googleLogin() {
        // Guard가 작동하여 구글 로그인 페이지로 리다이렉트함
        console.log('auth/google 진입');
    }

    @Post('google')
    @UseGuards(AuthGuard('google')) // App 로그인
    async appgoogleLogin() {
        console.log('auth/google 진입');
    }

    // 구글 로그인 콜백
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleLoginCallback(@Req() req: ExpressRequest, @Res() res: Response) {
        console.log('google/callback 진입');

        const { user } = req; // 네이버 로그인 성공 후의 사용자 정보

        const userFind = this.googleUserService.findOrCreate(user);

        console.log('userFind: ', userFind);

        // JWT 토큰 생성 및 사용자 정보를 프론트엔드에 전달
        const jwt = this.authService.googleJwtToken(user);

        // JWT 토큰을 포함하여 프론트엔드로 리디렉션
        res.redirect(`http://localhost:5173/auth/google/callback?token=${jwt}`);
    }

    // 네이버 로그인 URL
    @Get('naver')
    @UseGuards(AuthGuard('naver')) // Naver 전략 사용
    async naverLogin() {
        // Guard가 작동하여 네이버 로그인 페이지로 리다이렉트함
        console.log('auth/naver 진입');
    }

    // 네이버 로그인 콜백
    @Get('naver/callback')
    @UseGuards(AuthGuard('naver'))
    async naverLoginCallback(@Req() req: ExpressRequest, @Res() res: Response) {
        console.log('naver/callback 진입');
        // @ts-ignore
        const user = req.user; // 네이버 로그인 성공 후의 사용자 정보
        // @ts-ignore
        console.log(req.user);

        const userFind = this.naverUserService.findOrCreate(user);

        console.log(userFind);

        // JWT 토큰 생성 및 사용자 정보를 프론트엔드에 전달
        const jwt = this.authService.naverJwtToken(user);

        // JWT 토큰을 포함하여 프론트엔드로 리디렉션
        res.redirect(`http://localhost:5173/auth/naver/callback?token=${jwt}`);
    }
}