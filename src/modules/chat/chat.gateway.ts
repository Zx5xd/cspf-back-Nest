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
import {PetService} from "@/modules/pet/pet.service";
import {UserService} from "@/modules/user/user.service";

@WebSocketGateway({
    cors:{
        origin: true, // 정확한 클라이언트 도메인 명시
        methods: ['GET', 'POST'], // 허용할 메소드
        transports: ['websocket', 'polling'],
        credentials: true,
    },
    allowEI03:true
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server;
    private logger = new Logger('Chat Logger')

    constructor(
        private readonly chatLogService: ChatLogService,
        private readonly chatService: ChatService,
        private readonly userService: UserService,
        private readonly petService: PetService
    ) {}

    // 소켓 ID와 사용자 코드 매핑
    private users: Map<string, string> = new Map(); // socket.id -> userCode 매핑
    private userSockets: Map<string, string> = new Map(); // userCode -> socket.id 매핑

    afterInit(server: any): any {
        this.logger.log('afterInit');
        this.chatService.setServer(server);
    }

    @SubscribeMessage('signal')
    handleSignal(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        console.log('chat signal', data)
        client
            .to(data.room)
            .emit('signal', { signal: data.signal, from: client.id });
    }

    @SubscribeMessage('message')
    async handleMessage(@MessageBody() msg: string, @ConnectedSocket() client: Socket): Promise<void> {
        const userNickname = client.data.user?.sub.nickname ?? client.data.user.sub.name;
        const userCode = client.data.user?.sub;
        const roomId = client.data.roomId;
        console.log('message client, ', client.data.user)
        // const user = socket.data.user;  // 미들웨어에서 설정된 사용자 정보 사용
        console.log(`${roomId} - <${userCode}>`+msg);

        client.emit('newMessage',{
            roomId: roomId,
        })

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
    async getUsersInRoom(roomId: string): Promise<string[]> {
        const room = this.server.sockets.adapter.rooms.get(roomId);
        if (!room) {
            return []; // 룸이 없으면 빈 배열 반환
        }

        // 소켓 ID 리스트를 배열로 변환
        const clientsInRoom = Array.from(room);
        return clientsInRoom;
    }

    @SubscribeMessage('reqPet')
    handleRequestPetInfo(@MessageBody() req: {
        targetUserCode: string, reqData: string
    }, @ConnectedSocket() client: Socket) {
        const { targetUserCode, reqData } = req;
        const targetSocketId = this.userSockets.get(targetUserCode);

        if (targetSocketId) {
            this.server.to(targetSocketId).emit('reqPet', {
                fromUser: this.users.get(client.id),
                reqData,
            });
        }
    }

    @SubscribeMessage('acceptRequest')
    async handleAcceptPetInfo(
        @MessageBody() data: { targetUserCode: string },
        @ConnectedSocket() client: Socket,
    ) {
        const {targetUserCode} = data;
        const targetSocketId = this.userSockets.get(targetUserCode);
        const dogRegNo = await this.userService.getDogRegNo(client.data.user?.sub)
        const responseData = await this.petService.findOne(dogRegNo.pets[0].dogRegNo)

        if (targetSocketId) {
            this.server.to(targetSocketId).emit('acceptRequest', {
                fromUser: this.users.get(client.id),
                responseData,
            });
        }
    }

    handleConnection(@ConnectedSocket() client: Socket): any {
        const userCode = client.data.user?.sub;
        const roomId = client.data.roomId;

        console.log(client.id, userCode)

        if (!userCode || !roomId) {
            client.disconnect(true);  // 연결 종료
            return new Error('Missing user code or room ID');
        }

        // console.log('handleConnection', client.id, userCode, roomId);

        this.server.to(roomId).emit('join',{
            userCode:client.data.user?.sub,
            nickname:client.data.user?.nickname
        })
    }

    handleDisconnect(@ConnectedSocket() client: Socket): any {

        // console.log('handleDisconnect');

        client.to(client.data.roomId).emit('leave',{
            userCode:client.data.user?.sub,
            nickname:client.data.user?.nickname
        })
    }

}