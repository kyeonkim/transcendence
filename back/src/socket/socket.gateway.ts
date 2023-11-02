import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

//cors origin * is for development only
// @UseGuards(AuthGuard('jwt-ws'))
// @UseGuards(AuthGuard('jwt-ws'))
@WebSocketGateway({cors:{origin: '*'}})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  constructor(
    private readonly authService: AuthService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any): Promise<string> {
    // console.log('client', client, 'message', payload);
    return 'Hello world!';
  }

  @SubscribeMessage('events')
  async handleEvent(client: Socket, payload: any): Promise<string> {
    console.log('client', client, 'events', payload);
    await client.join(payload);
    console.log(`room created`, client.rooms);
    return 'Hello world!';
  }

  @SubscribeMessage('identity')
  async identity(client: Socket, data: number): Promise<number> {
    // console.log('client', client, 'identity', data);
    return data;
  }

  @SubscribeMessage('chat')
  async handlechat(client: Socket, payload: any): Promise<string> {
    // console.log('client', client.id, 'data', payload);
    client.broadcast.emit('chat', payload);
    // this.server.emit('chat', {from: client.id, message: payload}});
    return 'Hello world!';
  }

  async afterInit(server: Server) {
    // console.log('Init===========\n',server);
  }


  async handleConnection(client: Socket, ...args: any[]) {
    // console.log('Client connected=============\n', client.id,
    // `\nclient handshake =====================\n`, client.handshake);
    // console.log(client.rooms);
    // console.log(args);
  }

  async handleDisconnect(client: Socket) {
    // console.log('Client disconnected');
  }
}
