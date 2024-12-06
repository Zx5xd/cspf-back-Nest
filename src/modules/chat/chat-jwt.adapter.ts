import {IoAdapter} from "@nestjs/platform-socket.io";
import {INestApplication} from "@nestjs/common";
import {Server, Socket} from "socket.io";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {ChatRoomService} from "../chatroom/chatroom.service";
import * as cookie from 'cookie'
import {UserService} from "../user/user.service";
import {ExpertService} from "@/modules/expert/expert.service";
import {UserEntity} from "@/modules/user/user.entity";
import {UserType} from "@/types/chatTypes";
import {ExpertEntity} from "@/modules/expert/expert.entity";

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
        // 기본 Socket IO(WebSocket) 서버를 생성
        const server = super.createIOServer(port, options);

        // 서버에 연결된 클라이언트의 요청을 중간에 가로채는 미들웨어를 정의
        server.use(async (socket:Socket, next)=>{
            // 클라이언트에서 전송한 쿠키를 파싱
            const handshakeCookie = socket.handshake.headers.cookie;
            const cookies = handshakeCookie ? cookie.parse(handshakeCookie) : null;

            // 액세스 토큰을 auth에 authorization에서 받거나, 쿠키에서 authorization에서 받음
            const accessToken:string = socket.handshake.auth.authorization || cookies.authorization;

            // 쿼리에서 접속하려는 채팅방의 ID를 받음
            const roomId = socket.handshake.query.roomId as string | null | undefined;

            // 액세스 토큰이 존재하지 않는다면 소켓 연결 종료 후 error 반환
            if (!accessToken) {
                socket.disconnect(true);
                return next(new Error('No accessToken provided'));
            }
            // 채팅방 ID가 존재하지 않는다면 소켓 연결 종료 후 error 반환
            if (!roomId) {
                socket.disconnect(true);
                return next(new Error('No roomId provided'));
            }

            // 채팅방이 존재하는지 확인
            const existChatRoom = await this.chatRoomService.findOne(roomId);
            if (!existChatRoom) {
                return next(new Error('Not Found roomId provided'));
            }

            try {
                // JWT 토큰 검증 및 해석
                const secretKey = this.configService.get<string>('SECRET_KEY');
                const payload = this.jwtService.verify(accessToken, {
                    secret: secretKey
                });

                // 토큰의 username으로 유저를 검색 (User와 Expert 모두 확인)
                const findUser =
                  await this.userService.getUserById(payload.username) ??
                  await this.expertService.getExpertByUsername(payload.username);

                // 검색된 유저의 닉네임/이름을 payload에 추가
                payload.nickname = findUser instanceof UserEntity ? findUser.nickname : findUser.name;

                // 해당 채팅방의 접근 권한 확인
                if (!existChatRoom.accessUser.access.some(code => code===payload.sub)) {
                    return next(new Error('Not Found Access Permission'))
                }

                // Socket 데이터에 유저 유형(User 또는 Expert)과 사용자 정보를 저장
                socket.data.type = findUser instanceof UserEntity ? UserType.User : UserType.Expert;
                socket.data.user = payload;
                socket.data.roomId = roomId;
                socket.join(roomId)

                // 클라이언트를 해당 채팅방에 참여시킴
                next();
            } catch (error) {
                // JWT 토큰 검증 실패 시 에러 반환
                return next(new Error('Invalid token'));
            }
        })

        // 서버를 반환
        return server;
    }
}