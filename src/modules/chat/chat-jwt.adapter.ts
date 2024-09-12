import {IoAdapter} from "@nestjs/platform-socket.io";
import {INestApplication} from "@nestjs/common";
import { Server, Socket } from "socket.io";

export class ChatJwtAdapter extends IoAdapter {
    constructor(
        app:INestApplication
    ) {super(app);}

    createIOServer(port: number, options?: any): Server {
        const server = super.createIOServer(port, options);

        server.use(async (socket:Socket, next)=>{
            const accessToken:string = socket.handshake.query.accessToken as string || socket.handshake.headers['authorization'];
            const roomId = socket.handshake.query.roomId as string | null | undefined;

            if (!accessToken) {
                socket.disconnect(true)
                return next(new Error('No accessToken provided'));
            }
            if (!roomId) {
                socket.disconnect(true)
                return next(new Error('No roomId provided'));
            }


        })

        return super.createIOServer(port, options);
    }
}