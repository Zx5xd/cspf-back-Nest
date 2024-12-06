import {
    ConnectedSocket, MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import {ChatLogService} from "../chatlog/chatlog.service";
import {ChatService} from "./chat.service";
import {Chat, UserType} from "@/types/chatTypes";
import {PetService} from "@/modules/pet/pet.service";

@WebSocketGateway({
    cors:{
        origin: true, // 정확한 클라이언트 도메인 명시
        methods: ['GET', 'POST'], // 허용할 메소드
        credentials: true, // 인증 정보 전송 허용
    },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server;

    constructor(
        private readonly chatLogService: ChatLogService,
        private readonly chatService: ChatService,
    ) {}

    // WebSocket 서버 초기화 후 실행
    afterInit(server: Server): any {
        this.chatService.setServer(server);
    }

    // 클라이언트가 메시지를 보냈을 때 처리
    @SubscribeMessage('message')
    async handleMessage(@MessageBody() msg: Chat, @ConnectedSocket() client: Socket): Promise<void> {
        // 클라이언트의 Socket 데이터에서 필요한 정보 추출
        const { type: userType, user, roomId } = client.data;
        const { nickname, sub: userCode, profileImg = null } = user || {};

        // 메시지 객체에 사용자 정보 추가
        msg.userType = userType;
        msg.profile = { nickname, profileImg, userCode };

        // 같은 방에 있는 클라이언트들에게 메시지 브로드캐스트
        client.to(roomId).emit('message', msg);

        // 채팅 로그 저장
        await this.chatLogService.addChatMessage(roomId, msg);
    }

    // 최근 메시지 요청 처리
    @SubscribeMessage('recent')
    async handleRecent(@MessageBody() msg: { recentMsg: number }, @ConnectedSocket() client: Socket): Promise<void> {
        const { roomId, user } = client.data;

        // 채팅 로그에서 최근 메시지 n개 불러오기
        const recentMessages = await this.chatLogService.getChatLogsRoom(roomId, msg.recentMsg, user?.sub);

        // 클라이언트에게 최근 메시지 데이터 전송
        client.emit('recent', recentMessages);
    }

    // 클라이언트가 웹소켓 연결을 성공했을 때 처리
    handleConnection(@ConnectedSocket() client: Socket): void {
        const { roomId, user } = client.data;

        // 채팅방 내 모든 사용자에게 입장 이벤트 브로드캐스트
        this.server.to(roomId).emit('join', {
            userCode: user?.sub,
            nickname: user?.nickname,
        });
    }

    // 클라이언트가 웹소켓 연결을 끊었을 때 처리
    handleDisconnect(@ConnectedSocket() client: Socket): void {
        const { roomId, user } = client.data;

        // 채팅방 내 모든 사용자에게 퇴장 이벤트 브로드캐스트
        client.to(roomId).emit('leave', {
            userCode: user?.sub,
            nickname: user?.nickname,
        });
    }
}