import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { SocketService } from './socket.service';

//cors origin * is for development only
// @UseGuards(AuthGuard('jwt-ws'))
// @UseGuards(AuthGuard('jwt-ws'))
@WebSocketGateway({cors:{origin: '*'}})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor(
    private readonly authService: AuthService,
    private readonly SocketService: SocketService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any): Promise<string> {
    // console.log('client', client, 'message', payload);
    return 'Hello world!';
  }

  @SubscribeMessage('events')
  async handleEvent(client: Socket, payload: any): Promise<string> {
    console.log(`client ===========\n` , client);
    return 'Hello world!';
  }

  async JoinRoom(user_id: any, room_id: number)
  {
    this.SocketService.JoinRoom(user_id, room_id, this.server);
  }

  async LeaveRoom(user_id: any, room_id: number)
  {
    this.SocketService.LeaveRoom(user_id, room_id, this.server);
  }

  @SubscribeMessage('identity')
  async identity(client: Socket, data: number): Promise<number> {
    // console.log('client', client, 'identity', data);
    return data;
  }

  @SubscribeMessage('chat')
  async handlechat(client: Socket, payload: any): Promise<string> {
    console.log('client', client.id, 'data', payload);
    console.log('room: ', client.rooms);
    client.broadcast.to(payload.room_id).emit('chat', {from: payload.user_name, message: payload.message});
    // this.server.emit('chat', {from: client.id, message: payload}});
    return 'Hello world!';
  }

  async afterInit(server: Server) {
    // console.log('Init===========\n',server);
  }


  async handleConnection(client: Socket, ...args: any[]) {
    // console.log('Client connected=============\n', client.id,
    // `\nclient handshake =====================\n`, client.handshake);

    //토큰인증로직 
    //if 토큰인증 실패 >> disconnect
    if (client.handshake.query.user_id === undefined)
      client.disconnect();
    else
    {
      console.log(client.id, client.handshake.query.user_id);
      const connect_user = await this.SocketService.Connect(client.handshake.query.user_id, client.id, this.server);
      if (connect_user === null)
        client.disconnect();
      else if (connect_user.chatroom_id !== null)
      {
        console.log("join room: ", connect_user.user_id, connect_user.chatroom_id);
        await this.JoinRoom(connect_user.user_id, connect_user.chatroom_id);
      }
    }
  }

  async handleDisconnect(client: Socket) {
    if (client.handshake.query.user_id !== undefined)
    {
      console.log('\n\nClient disconnected=============\n', client.handshake.query.user_id ,client.id)
      this.SocketService.Disconnect(client.handshake.query.user_id, client.id);
      // console.log(this.server.sockets.sockets,"\n");
    }
    // console.log('Client disconnected');
  }
}
