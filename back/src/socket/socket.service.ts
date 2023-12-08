import { Injectable } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SocketService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}
    private sockets = new Map<string, string>();

    async Connect(user_id: any, socket_id: string, server: Server)
    {
        const user = await this.prismaService.user.findUnique({
            where: {
                user_id: Number(user_id),
            },
            include: {
                friends: true,
                roomuser: true,
                blocks: true
            }
        });
        if (user === null)
            throw new Error("user is not exist");
        if (this.sockets.get(String(user_id)) !== undefined)
        {
            server.sockets.sockets.get(this.sockets.get(String(user_id))).disconnect();
            console.log("disconnected ?: ", server.sockets.sockets.get(String(user_id)));
            this.sockets.delete(String(user_id));
        }
        this.sockets.set(String(user_id), socket_id);
        
        return user;
    }

    async GetSocketId(user_id: any)
    {
        return this.sockets.get(user_id);
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
        if (user === null)
            return {status: false, message: "채팅방에 속해있지 않습니다."};
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
        console.log("HandleChat: ", user);
        console.log("HandleChat2: ", payload);
        if (user.chatroom_id != payload.room_id || user.is_mute === true)
            return {status: false, message: "채팅을 할 수 없습니다."};
        server.to(`chat-${payload.room_id}`).except(`block-${user.user_id}`).emit('chat', {from: payload.user_name, message: payload.message, time: new Date().valueOf()});
        return {status: true, message: "["+payload.message + "] 채팅을 전송하였습니다."};
    }

    async HandleNotice(chatroom_id: number, message: string, server: Server)
    {
        const result = server.to(`chat-${chatroom_id}`).emit('notice', {message: message, time: new Date().valueOf()});
        if (result === false)
            return {status: false, message: "공지를 할 수 없습니다."}
        console.log("HandleNotice: ", message);
        return {status: true, message: "공지를 전송하였습니다."};
    }

    async HandleKick(user_id: number, server: Server)
    {
        const result = server.to(String(user_id)).emit('kick', {message: user_id, time: new Date().valueOf()});
        if (result === false)
            return {status: false, message: "kick 명령 전송 실패."}
        console.log("HandleKick: ", user_id);
        return {status: true, message: "kick 명령 전송 완료."};
    }
    

    async JoinRoom(user_id: any, room: string, server: Server)
    {
        console.log("JoinRoom user_id: ", user_id, " | JoinRoom: ", this.sockets.get(String(user_id)) || "logoff");
        if(this.sockets.get(String(user_id)) !== undefined)
            server.sockets.sockets.get(this.sockets.get(String(user_id))).join(room);
    }

    async LeaveRoom(user_id: string, room: string, server: Server)
    {
        console.log("LeaveRoom user_id: ", user_id, " | LeaveRoom: ", room);
        if(this.sockets.get(String(user_id)) !== undefined)
        {
            if (server.sockets.sockets.get(this.sockets.get(String(user_id))) !== undefined)
                server.sockets.sockets.get(this.sockets.get(String(user_id))).leave(room);
        }
    }

    async SendStatusTest(user_id: any, status: string, server: Server)
    {
        server.emit(`status`, {user_id: user_id, status: status});
    }

    async SendDm(from_id: number,to_id: number, message: string, server: Server)
    {
        const msg = await this.prismaService.message.create({
            data: {
                from_id,
                to_id,
                content: message,
            }
        });
        server.to(String(to_id)).emit('dm', msg);
        server.to(String(from_id)).emit('dm', msg);
    }

    async ReadDm(idx: number)
    {
        await this.prismaService.message.update({
            where: {
                idx: idx,
            },
            data: {
                is_read: true,
            }
        });
    }

    async GetDm(user_id: number, server: Server)
    {
        const dm = await this.prismaService.message.findMany({
            where: {
                to_id: Number(user_id),
                is_read: false,
            },
        });
        // console.log("GetDm: ", dm);
        dm.forEach((element) => {
            server.to(String(user_id)).emit('dm', element);
        });
    }
}
