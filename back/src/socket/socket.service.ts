import { Injectable } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SocketService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}
    private sockets = new Map<any, string>();

    async Connect(user_id: any, socket_id: string, server: Server)
    {
        // if (this.sockets.get(user_id) === undefined)
        //     this.sockets.set(user_id, [socket_id]);
        // else
        //     this.sockets.get(user_id).push(socket_id);
        if (this.sockets.get(String(user_id)) !== undefined)
        {
            server.sockets.sockets.get(this.sockets.get(String(user_id))).disconnect();
            console.log("disconnected ?: ", server.sockets.sockets.get(String(user_id)));
            this.sockets.delete(String(user_id));
        }
        this.sockets.set(String(user_id), socket_id);
        
        console.log("Connect: ", this.sockets.get(String(user_id)));
        const user = await this.prismaService.user.findUnique({
            where: {
                user_id: Number(user_id),
            },
            include: {
                roomuser: true,
            }
        });
        return user;
    }

    async Disconnect(user_id: any, socket_id: string)
    {
        this.sockets.delete(user_id);
        // const index = this.sockets.get(user_id).indexOf(socket_id);
        // if (index > -1)
            // this.sockets.get(user_id).splice(index, 1);
    }

    async HandleChat(client: Socket, payload: any, server: Server)
    {
        const user = await this.prismaService.chatroom_user.findUnique({
            where: {
                user_id: Number(client.handshake.query.user_id),
            },
        });
        if (user.is_mute === true && Number(user.mute_time) < new Date().valueOf())
        {
            user.is_mute = false;
            await this.prismaService.chatroom_user.update({
                where: {
                    user_id: Number(client.handshake.query.user_id),
                },
                data: {
                    is_mute: false,
                }
            });
        }
        if (user === null || user.chatroom_id != payload.room_id || user.is_mute === true)
            return {status: false, message: "채팅을 할 수 없습니다."};
        server.to(String(payload.room_id)).emit('chat', {from: payload.user_name, message: payload.message, time: new Date().valueOf()});
        return {status: true, message: "채팅을 전송하였습니다."};
    }

    async HandleNotice(chatroom_id: number, message: string, server: Server)
    {
        server.to(String(chatroom_id)).emit('notice', {message: message, time: new Date().valueOf()});
        return {status: true, message: "공지를 전송하였습니다."};
    }

    async JoinRoom(user_id: any, room_idx: number, server: Server)
    {
        console.log("JoinRoom: ", this.sockets.get(String(user_id)));
        server.sockets.sockets.get(this.sockets.get(String(user_id))).join(String(room_idx));
    }

    async LeaveRoom(user_id: any, room_idx: number, server: Server)
    {
        if(this.sockets.get(String(user_id)) !== undefined)
            server.sockets.sockets.get(this.sockets.get(String(user_id))).leave(String(room_idx));
    }
}
