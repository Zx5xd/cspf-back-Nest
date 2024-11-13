import {IoAdapter} from "@nestjs/platform-socket.io";
import {INestApplication, Injectable} from "@nestjs/common";
import { Server, Socket } from "socket.io";
import {AuthService} from "../auth/auth.service";
import process from "process";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {ChatRoomService} from "../chatroom/chatroom.service";

export class ChatJwtAdapter extends IoAdapter {
    constructor(
        app:INestApplication,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly chatRoomService: ChatRoomService,
    ) {super(app);}

    createIOServer(port: number, options?: any): Server {
        const server = super.createIOServer(port, options);

        server.use(async (socket:Socket, next)=>{
            console.log("socket address: ",socket.handshake.address)
            // const accessToken:string = socket.handshake.query.accessToken as string ||  socket.handshake.auth.authorization;
            const accessToken: string =
                socket.handshake.query.accessToken as string ||
                socket.handshake.auth.authorization ||
                (socket.handshake.headers.cookie
                    ?.split('; ')
                    .find(row => row.startsWith('authorization='))
                    ?.split('=')[1] || '');  // 쿠키에서 'authorization' 토큰 추출

            const roomId = socket.handshake.query.roomId as string | null | undefined;

            if (!accessToken) {
                socket.disconnect(true)
                return next(new Error('No accessToken provided'));
            }
            if (!roomId) {
                socket.disconnect(true)
                return next(new Error('No roomId provided'));
            }

            const existChatRoom = await this.chatRoomService.findOne(roomId);
            if (!existChatRoom) {
                return next(new Error('Not Found roomId provided'));
            }

            try {
                const secretKey = this.configService.get<string>('SECRET_KEY');
                const payload = this.jwtService.verify(accessToken, {
                    secret: secretKey
                });

                if (!existChatRoom.accessUser.access.some(code => code===payload.sub)) {
                    return next(new Error('Not Found Access Permission'))
                }

                socket.data.user = payload;
                socket.data.roomId = roomId;
                socket.join(roomId)
                next();
            } catch (error) {
                return next(new Error('Invalid token'));
            }
        })

        return server;
    }
}