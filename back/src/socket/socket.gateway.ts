import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';

//cors origin * is for development only
// @UseGuards(AuthGuard('jwt-ws'))
// @UseGuards(AuthGuard('jwt-ws'))
@WebSocketGateway({cors:{origin: '*'}})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  constructor(
    private readonly authService: AuthService,
  ) {}
  @WebSocketServer() server: any;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    // console.log('client', client, 'message', payload);
    return 'Hello world!';
  }

  @SubscribeMessage('events')
  handleEvent(client: any, payload: any): string {
    console.log('client', client.id, 'events', payload);
    return 'Hello world!';
  }

  @SubscribeMessage('identity')
  async identity(client: any, data: number): Promise<number> {
    // console.log('client', client, 'identity', data);
    return data;
  }

  @SubscribeMessage('chat')
  handlechat(client: any, payload: any): string {
    console.log('client', client.id, 'data', payload);
    client.broadcast.emit('chat', payload);
    // this.server.emit('chat', {from: client.id, message: payload}});
    return 'Hello world!';
  }

  afterInit(server: any) {
    console.log('Init===========\n',server);
  }


  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected=============\n', client.id,
    `\nclient handshake =====================\n`, client.handshake);
    // console.log(args);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected');
  }
}
