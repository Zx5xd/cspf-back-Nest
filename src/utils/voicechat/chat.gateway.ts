// src/voicechat/voicechat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface User {
  id: string;
  socketId: string;
  room: string;
}

@WebSocketGateway({
  cors: {
    origin: 'http://hyproz.myds.me:5173',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: User[] = [];

  handleConnection(client: Socket) {
    console.log('Connect-client.id = ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Disconnect-client.id = ', client.id);
    // 클라이언트가 연결 해제될 때 사용자 목록에서 제거하고 방을 업데이트합니다.
    this.users = this.users.filter((user) => user.socketId !== client.id);
    // 연결 해제된 사용자가 포함된 모든 방을 업데이트합니다.
    this.users.forEach((user) => {
      this.server
        .to(user.room)
        .emit('updateUserList', this.getUsersInRoom(user.room));
    });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { userId: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);

    this.users.push({ id: data.userId, socketId: client.id, room: data.room });
    this.server
      .to(data.room)
      .emit('updateUserList', this.getUsersInRoom(data.room));
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.room);
    this.users = this.users.filter((user) => user.socketId !== client.id);
    this.server
      .to(data.room)
      .emit('updateUserList', this.getUsersInRoom(data.room));
  }

  @SubscribeMessage('signal')
  handleSignal(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client
      .to(data.room)
      .emit('signal', { signal: data.signal, from: client.id });
  }

  // 특정 방의 사용자 목록 반환
  private getUsersInRoom(room: string): User[] {
    return this.users.filter((user) => user.room === room);
  }
}
