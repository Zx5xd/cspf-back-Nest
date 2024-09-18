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

@WebSocketGateway({
    cors:{
        origin: '*',
        credentials: true,
    },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server;
    private logger = new Logger('Chat Logger')

    constructor(
        private readonly chatLogService: ChatLogService
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
        console.log(`${roomId} - <${userCode}>`+msg);
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
    }

    handleDisconnect(client: any): any {
    }

}