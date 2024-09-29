import {Injectable} from "@nestjs/common";
import {Server} from "socket.io";

@Injectable()
export class ChatService {
  private server: Server;

  setServer(server:Server) {
    this.server = server;
  }

  sendMessageToAll(event:string, message: any) {
    this.server.emit(event, message);
  }

  sendMessageToRoom(room:string, event:string, message:any) {
    this.server.to(room).emit(event, message);
  }
}