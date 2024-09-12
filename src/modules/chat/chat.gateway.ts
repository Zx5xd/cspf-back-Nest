import {
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {Logger} from "@nestjs/common";
import { Server, Socket } from "socket.io";

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

    ) {}

    afterInit(server: any): any {
    }

    handleConnection(@ConnectedSocket() client: Socket): any {
        
    }

    handleDisconnect(client: any): any {
    }

}