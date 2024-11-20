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
import {Chat, UserType} from "@/types/chatTypes";
import {PetService} from "@/modules/pet/pet.service";

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
        private readonly chatService: ChatService,
        private readonly petService: PetService
    ) {}

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
    async handleMessage(@MessageBody() msg: Chat, @ConnectedSocket() client: Socket): Promise<void> {
        const userType:UserType = client.data.type;
        const userNickname = client.data.user?.nickname;
        const userCode = client.data.user?.sub;
        const profileImg = client.data.user?.profileImg ?? null;
        const roomId = client.data.roomId;
        // const user = socket.data.user;  // 미들웨어에서 설정된 사용자 정보 사용
        console.log(`${roomId} - <${userCode}>`+msg.msg);

        // client.emit('newMessage',{
        //     roomId: roomId,
        // })

        msg.userType = userType;
        msg.profile = {
            nickname: userNickname,
            profileImg: profileImg,
            userCode
        }

        client.to(roomId).emit('message',msg)

        await this.chatLogService.addChatMessage(roomId,msg)
        //this.server.emit('message', { user, message });

    }

    @SubscribeMessage('recent')
    async handleRecent(@MessageBody() msg: {recentMsg:number}, @ConnectedSocket() client: Socket):Promise<void> {
        const recentMessage = await this.chatLogService.getChatLogsRoom(client.data.roomId, msg.recentMsg,client.data.user?.sub);
        client.emit("recent",recentMessage)
    }

    /*sendMessageToRoom(roomId:string, message: string) {
        this.server.to(roomId).emit('message',message)
        // this.logger.log(roomId+':'+message)
        console.log(roomId+':'+JSON.stringify(message))
    }*/

    @SubscribeMessage('wantPetInfo')
    reqPetInfo(@ConnectedSocket() client: Socket){
        const userNickname = client.data.user?.nickname;
        const userCode = client.data.user?.userCode;
        const roomId = client.data.roomId;

        console.log('wantPetInfo')

        this.server.to(roomId).emit('wantPetInfo',{
            sender: userCode,
            senderNickName: userNickname
        })
    }

    @SubscribeMessage('sendPetInfo')
    async sendPetInfo(@MessageBody() msg:any, @ConnectedSocket() client: Socket) {
        const userCode = client.data.user?.userCode;
        const userNickname = client.data.user?.nickname;
        const roomId = client.data.roomId;

        if(msg.msgCode === 1){
            const petInfo = await this.petService.findOneToUser(userCode)

            this.server.to(roomId).emit('sendPetInfo', {
                sender: userCode,
                senderNickName: userNickname,
                petInfo: petInfo,
                successCode: 1
            })
        }else{
            this.server.to(roomId).emit('sendPetInfo', {
                senderNickName: userNickname,
                successCode: 0
            })
        }

    }

    handleConnection(@ConnectedSocket() client: Socket): any {
        const userCode = client.data.user?.sub;
        const roomId = client.data.roomId;

        if (!userCode || !roomId) {
            client.disconnect(true);  // 연결 종료
            return new Error('Missing user code or room ID');
        }

        console.log('handleConnection', client.id, userCode, roomId);

        this.server.to(roomId).emit('join',{
            userCode:client.data.user?.sub,
            nickname:client.data.user?.nickname
        })
    }

    handleDisconnect(@ConnectedSocket() client: Socket): any {

        console.log('handleDisconnect');

        client.to(client.data.roomId).emit('leave',{
            userCode:client.data.user?.sub,
            nickname:client.data.user?.nickname
        })
    }

}