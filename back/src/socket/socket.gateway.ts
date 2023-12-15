import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { SocketService } from './socket.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { instrument } from "@socket.io/admin-ui";
import { GameRoom } from 'src/game/game.service';
import { SocketGameService } from 'src/socket/socket.gameservice';

//cors origin * is for development only
// @UseGuards(AuthGuard('jwt-ws'))
// @UseGuards(AuthGuard('jwt-ws'))
@WebSocketGateway({cors:{origin: '*'}})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor(
    private readonly authService: AuthService,
    private readonly SocketService: SocketService,
    private readonly prismaService: PrismaService,
    private readonly SocketGameService: SocketGameService,
  ) {}
  @WebSocketServer() server: Server;

  async afterInit(server: Server) {
      instrument(this.server, {
        // auth: {
        //   type: "basic",
        //   username: "admin",
        //   password: "$2a$10$mR.33xR3G4dDzDgQGhJ5T.Sb8uENPDO48K8An8wVxo4DLL5VaREiS" // "changeit" encrypted with bcrypt
        // },
        auth: false,
        mode: "development",
    });

    this.SocketGameService.setServer(server);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    //토큰인증로직 
    //if 토큰인증 실패 >> disconnect
    try {
      if (client.handshake.query.user_id == 'undefined' || client.handshake.query.user_id == undefined)
          throw new Error("user_id is undefined");
      
      const connect_user = await this.SocketService.Connect(client.handshake.query.user_id, client.id, this.server);
      connect_user.roomuser ? await this.JoinRoom(connect_user.user_id, `chat-${connect_user.roomuser.chatroom_id}`) : null;
      client.join(String(connect_user.user_id));
      client.join(`status-${connect_user.user_id}`);
      connect_user.friends.map(async (friend) => {
        const res = await this.SocketService.JoinRoom(friend.followed_user_id, `status-${connect_user.user_id}`, this.server);
        if (res.status === true)
          this.SocketService.JoinRoom(connect_user.user_id, `status-${friend.followed_user_id}`, this.server);
    });
      connect_user.blocks.map((block) => {this.SocketService.JoinRoom(block.blocked_user_id, `block-${connect_user.user_id}`, this.server)});
    } catch (error) {
      console.error("handleConnection: ", error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    if (client.handshake.query.user_id !== undefined)
    {
      this.server.to(`status-${client.handshake.query.user_id}`).emit(`status`, {user_id: client.handshake.query.user_id, status: 'offline'});
      this.SocketGameService.ForceGameEnd(Number(client.handshake.query.user_id));
      this.SocketService.Disconnect(client.handshake.query.user_id, client.id);
    }
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
    this.server.to(`chat-${chatroom_id}`).emit('kick', {message: "방이 삭제되었습니다."});
    this.server.to(`chat-${chatroom_id}`).socketsLeave(String(chatroom_id));
  }
  
  async JoinRoom(user_id: any, room_id: string)
  {
    this.SocketService.JoinRoom(user_id, String(room_id), this.server);
  }
  
  async LeaveRoom(user_id: any, room_id: string)
  {
    this.SocketService.LeaveRoom(user_id, String(room_id), this.server);
  }
  
  async SendRerenderChatRoom(room_id: number, payload)
  {
    this.server.to(`chat-${room_id}`).emit(`render-chat`, {data: payload});
  }

  async SendRerender(user_id: number, event: string, payload?: any)
  {
    const rtn = this.server.to(String(user_id)).emit(`render-${event}`, { data: payload ? payload : new Date().valueOf() });
  }
  
  async SendRerenderAll(event: string, payload?: any)
  {
    const rtn = this.server.emit(`render-${event}`, { data: payload ? payload : new Date().valueOf() });
  }
  
  @SubscribeMessage('chat')
  async handlechat(client: Socket, payload: any): Promise<any> {
    const rtn = await this.SocketService.HandleChat(client, payload, this.server);
    return rtn;
  }

  @SubscribeMessage('status')
  async SendStatus(Client: Socket, payload: any)
  {
    if(payload.target === undefined)
      Client.to(`status-${payload.user_id}`).emit(`status`, {user_id: payload.user_id, status: payload.status});
    else
      Client.to(`${payload.target}`).emit(`status`, {user_id: payload.user_id, status: payload.status});
  }

  @SubscribeMessage(`dm`)
  async SendDM(Client: Socket, payload: any)
  {
    await this.SocketService.SendDm(payload.from_id, payload.to_id, payload.message, this.server);
  }

  @SubscribeMessage(`dmread`)
  async ReadDM(Client: Socket, payload: any)
  {
    await this.SocketService.ReadDm(payload.idx);
  }

  @SubscribeMessage(`getdm`)
  async GetDM(Client: Socket, payload: any)
  {
    await this.SocketService.GetDm(payload.user_id, this.server);
  }

  async SendReRenderGameRoom(room:GameRoom, user1_id: number, user2_id: number = null)
  {
    this.server.to(String(user1_id)).emit(`render-gameroom`, {room: room});
    if (user2_id !== null)
      this.server.to(String(user2_id)).emit(`render-gameroom`, {room: room});
  }

  async SendDMTest(from_id: number, to_id: number, message: string)
  {
    await this.SocketService.SendDm(from_id, to_id, message, this.server);
  }

  @SubscribeMessage(`game-start`)
  async GameStart(Client: Socket, payload: any)
  {
    await this.SocketGameService.GameStart(payload);
  }

  @SubscribeMessage(`game-user-position`)
  async GameUserPosition(Client: Socket, payload: any)
  {
    await this.SocketGameService.GameUserPosition(payload, Number(Client.handshake.query.user_id));
  }

  @SubscribeMessage(`game-ball-hit`)
  async GameBallHit(Client: Socket, payload: any)
  {
    await this.SocketGameService.GameBallHit(payload, Number(Client.handshake.query.user_id));
  }
}
