import {AuthGuard} from "@nestjs/passport";
import {ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        // console.log('JwtAuthGuard constructor called');
        super();
    }

    canActivate(context: ExecutionContext) {
        // 기본 AuthGuard의 동작을 유지합니다.
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }

    // Request 객체에서 쿠키에서 JWT를 추출하도록 수정
    getRequest(context: ExecutionContext): Request {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['authorization'];  // 쿠키에서 'authorization' 값 가져옴
        console.log('jwtToken Info, ', token);
        if (!token) {
            throw new UnauthorizedException('JWT token is missing in cookies');
        }
        request.headers.authorization = `Bearer ${token}`; // 쿠키에서 가져온 JWT를 Authorization 헤더로 설정
        return request;
    }
}