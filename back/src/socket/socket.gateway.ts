import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { SocketService } from './socket.service';
import { PrismaService } from 'src/prisma/prisma.service';

//cors origin * is for development only
// @UseGuards(AuthGuard('jwt-ws'))
// @UseGuards(AuthGuard('jwt-ws'))
@WebSocketGateway({cors:{origin: '*'}})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor(
    private readonly authService: AuthService,
    private readonly SocketService: SocketService,
    private readonly prismaService: PrismaService,
  ) {}
  @WebSocketServer() server: Server;

  async afterInit(server: Server) {
    // console.log('Init===========\n',server);
  }


  async handleConnection(client: Socket, ...args: any[]) {
    // console.log('Client connected=============\n', client.id,
    // `\nclient handshake =====================\n`, client.handshake);

    //토큰인증로직 
    //if 토큰인증 실패 >> disconnect
    console.log(client.id, client.handshake.query.user_id == 'undefined');
    if (client.handshake.query.user_id == 'undefined')
      client.disconnect();
    else
    {
      console.log("=============client.id, client.handshake.query.user_id=============\n",client.id, client.handshake.query.user_id);
      const connect_user = await this.SocketService.Connect(client.handshake.query.user_id, client.id, this.server);
      console.log("=============connect_user=================\n", connect_user);
      if (connect_user === null)
        client.disconnect();
      else if (connect_user.roomuser !== null)
      {
        console.log("join room: ", connect_user.user_id, connect_user.roomuser.chatroom_id);
        await this.JoinRoom(connect_user.user_id, connect_user.nick_name, connect_user.roomuser.chatroom_id);
      }
      client.join(connect_user.nick_name);
      connect_user.friends.map((friend) => { this.SocketService.JoinRoom(friend.followed_user_id, connect_user.nick_name, this.server)})
      client.join(String(client.handshake.query.user_id));
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
  
  @SubscribeMessage('chat')
  async handlechat(client: Socket, payload: any): Promise<any> {
    const rtn = await this.SocketService.HandleChat(client, payload, this.server);
    console.log(rtn);
    return rtn;
  }

  async HandleNotice(chatroom_id: number, message: string)
  {
    return await this.SocketService.HandleNotice(chatroom_id, message, this.server);
  }

  async HandleKick(user_id: number, chatroom_id: number)
  {
    await this.SocketService.HandleKick(user_id, this.server);
  }

  async DeleteRoom(chatroom_id: number)
  {
    this.server.to(String(chatroom_id)).emit('kick', {message: "방이 삭제되었습니다."});
    this.server.to(String(chatroom_id)).socketsLeave(String(chatroom_id));
  }

  async JoinRoom(user_id: any, user_nickname: string, room_id: number)
  {
    this.SocketService.JoinRoom(user_id, String(room_id), this.server);
  }

  async LeaveRoom(user_id: any, user_nickname: string, room_id: number)
  {
    this.SocketService.LeaveRoom(user_id, String(room_id), this.server);
  }
}
