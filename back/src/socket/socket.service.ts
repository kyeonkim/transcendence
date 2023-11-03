import { Injectable } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { Server } from 'socket.io';
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
            
        const user = await this.prismaService.user.findUnique({
            where: {
                user_id: Number(user_id),
            },

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
