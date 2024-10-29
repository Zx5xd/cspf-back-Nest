import { Controller, Get, Req, Res} from "@nestjs/common";
import {AdminService} from "./admin.service";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService:AdminService,
        private readonly jwtService:JwtService,
        private readonly configService: ConfigService,
    ) {}

    @Get()
    async existAdmin(@Req() req, @Res() res) {
        console.log(req)
        const secretKey = this.configService.get<string>('SECRET_KEY');
        const authorization = req.cookies['authorization']
        if (!authorization) {
            res.status(401).send({message: 'Authorization Token not found'})
        }

        const payload = this.jwtService.verify(authorization,{secret:secretKey})

        const existAdmin = await this.adminService.findOne(payload.sub,payload.username)
        if (!existAdmin) {
            res.status(401).send({ message: 'Admin not found' })
        }

        res.send({ message: 'Admin found' })
    }
}