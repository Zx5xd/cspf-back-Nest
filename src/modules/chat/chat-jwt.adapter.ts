import {IoAdapter} from "@nestjs/platform-socket.io";
import {INestApplication} from "@nestjs/common";
import { Server, Socket } from "socket.io";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {ChatRoomService} from "../chatroom/chatroom.service";
import * as cookie from 'cookie'
import {UserService} from "../user/user.service";
import {ExpertService} from "@/modules/expert/expert.service";
import {UserEntity} from "@/modules/user/user.entity";

export class ChatJwtAdapter extends IoAdapter {
    constructor(
        app:INestApplication,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly chatRoomService: ChatRoomService,
        private readonly userService: UserService,
        private readonly expertService: ExpertService
    ) {super(app);}

    createIOServer(port: number, options?: any): Server {
        const server = super.createIOServer(port, options);

        server.use(async (socket:Socket, next)=>{
            // console.log("socket address: ",socket.handshake.address)
            // console.log("socket headers: ", socket.handshake.headers);
            const handshakeCookie = socket.handshake.headers.cookie;
            const cookies = handshakeCookie ? cookie.parse(handshakeCookie) : null

            const accessToken:string = socket.handshake.query.accessToken as string || socket.handshake.auth.authorization || cookies.authorization;

            // console.log('accessToken, ', accessToken)


            const roomId = socket.handshake.query.roomId as string | null | undefined;
            // console.log('roomId, ', roomId)

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
                // console.log('secretKey', secretKey);
                // console.log('payload', payload);

                const findUser = await this.userService.getUserById(payload.username) ?? await this.expertService.getExpertByUsername(payload.username);
                payload.nickname = findUser instanceof UserEntity ? findUser.nickname : findUser.name;
                console.log('findUser Entity', findUser instanceof UserEntity, findUser instanceof ExpertEntity);

                if (!existChatRoom.accessUser.access.some(code => code===payload.sub)) {
                    return next(new Error('Not Found Access Permission'))
                }

                socket.data.type = findUser instanceof UserEntity ? UserType.User : UserType.Expert;
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