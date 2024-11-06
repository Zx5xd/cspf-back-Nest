import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import process from "process";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        // console.log('JwtStrategy constructor called');
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:configService.get<string>('SECRET_KEY'),
        });
    }

    async validate(payload: any) {
        // console.log('JwtStrategy validate called', payload);
        return { userCode: payload.sub, username: payload.username }
    }
}