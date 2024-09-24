import {
    ConnectedSocket, MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {Logger} from "@nestjs/common";
import { Server, Socket } from "socket.io";
import {ChatLogService} from "../chatlog/chatlog.service";
import {ImageService} from "../image/image.service";
import { Buffer } from 'buffer';

@WebSocketGateway({
    namespace:'main',
    cors:{
        origin: ['http://localhost:5173','*'], // 정확한 클라이언트 도메인 명시
        methods: ['GET', 'POST'], // 허용할 메소드
        credentials: true,
    },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server;
    private logger = new Logger('Chat Logger')

    constructor(
        private readonly chatLogService: ChatLogService,
        private readonly imageService: ImageService
    ) {
        this.logger.log('constructor')
    }

    afterInit(server: any): any {
        this.logger.log('afterInit');
    }

    @SubscribeMessage('message')
    async handleMessage(@MessageBody() msg: string, @ConnectedSocket() client: Socket): Promise<void> {
        const userNickname = client.data.user?.nickname;
        const userCode = client.data.user?.sub;
        const roomId = client.data.roomId;
        //const user = socket.data.user;  // 미들웨어에서 설정된 사용자 정보 사용
        // console.log(`${roomId} - <${userCode}>`+msg);

        client.to(roomId).emit('message',{
            sender:userNickname,
            message:msg
        })

        await this.chatLogService.addChatMessage(roomId,userCode,msg)
        //this.server.emit('message', { user, message });
    }

    handleConnection(@ConnectedSocket() client: Socket): any {
        const userCode = client.data.user?.sub;
        const roomId = client.data.roomId;

        if (!userCode || !roomId) {
            client.disconnect(true);  // 연결 종료
            return new Error('Missing user code or room ID');
        }

        client.to(roomId).emit('join',{
            userCode:client.data.user?.sub,
            nickname:client.data.user?.nickname
        })
    }

    handleDisconnect(@ConnectedSocket() client: Socket): any {
        client.to(client.data.roomId).emit('leave',{
            userCode:client.data.user?.sub,
            nickname:client.data.user?.nickname
        })
    }

}