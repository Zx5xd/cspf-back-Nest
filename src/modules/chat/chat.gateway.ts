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
import {ChatService} from "./chat.service";

@WebSocketGateway({
    cors:{
        origin: true, // 정확한 클라이언트 도메인 명시
        methods: ['GET', 'POST'], // 허용할 메소드
        credentials: true,
    },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server;
    private logger = new Logger('Chat Logger')

    constructor(
        private readonly chatLogService: ChatLogService,
        private readonly chatService: ChatService
    ) {}

    afterInit(server: any): any {
        this.logger.log('afterInit');
        this.chatService.setServer(server);
    }

    @SubscribeMessage('signal')
    handleSignal(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        client
            .to(data.room)
            .emit('signal', { signal: data.signal, from: client.id });
    }

    @SubscribeMessage('message')
    async handleMessage(@MessageBody() msg: string, @ConnectedSocket() client: Socket): Promise<void> {
        const userNickname = client.data.user?.nickname;
        const userCode = client.data.user?.sub;
        const roomId = client.data.roomId;
        // const user = socket.data.user;  // 미들웨어에서 설정된 사용자 정보 사용
        console.log(`${roomId} - <${userNickname}>`+msg);

        client.to(roomId).emit('message',{
            sender:userNickname,
            message:msg
        })

        await this.chatLogService.addChatMessage(roomId,userCode,msg)
        //this.server.emit('message', { user, message });
    }

    /*sendMessageToRoom(roomId:string, message: string) {
        this.server.to(roomId).emit('message',message)
        // this.logger.log(roomId+':'+message)
        console.log(roomId+':'+JSON.stringify(message))
    }*/

    handleConnection(@ConnectedSocket() client: Socket): any {
        const userCode = client.data.user?.sub;
        const roomId = client.data.roomId;

        if (!userCode || !roomId) {
            client.disconnect(true);  // 연결 종료
            return new Error('Missing user code or room ID');
        }

        this.server.to(roomId).emit('join',{
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