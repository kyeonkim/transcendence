import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto, JoinRoomDto } from './dto/chat.dto';
import { SocketGateway } from 'src/socket/socket.gateway';
import { async } from 'rxjs';

@Injectable()
export class ChatService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly socketGateway: SocketGateway,
    ) {}
    
    async GetRoomList()
    {
        const rooms = await this.prismaService.chatroom.findMany();
        return {status: true, message: 'success', rooms: rooms};
    }

    async RoomInfo(room_idx : number)
    {
        const roomInfo = await this.prismaService.chatroom.findUnique({
            where: {
                idx: room_idx,
            },
            include: {
                users: true,
            },
        });
        return {status: true, message: 'success', room: roomInfo}
    }

    async CreateRoom(data: CreateRoomDto)
    {
        const room = await this.prismaService.chatroom.create({
            data: {
                owner_id: data.user_id,
                name: data.chatroom_name,
                password: data.password ? data.password : null,
                private: data.private,
            },
        });
        if (room === undefined)
            return {status: false, message: 'fail to create room'};
        await this.prismaService.user.update({
            where: {
                user_id: data.user_id,
            },
            data: {
                chatroom_id: room.idx,
            },
        });
        return {status: true, message: 'success', room: room};
    }

    async JoinRoom(data: JoinRoomDto)
    {
        await this.prismaService.chatroom.update({
            where: {
                idx: data.room_id,
            },
            data: {
                users: {
                    connect: {
                        user_id: data.user_id,
                    },
                },
            },
        });
        await this.socketGateway.JoinRoom(data.user_id, data.room_id);
    }

    async LeaveRoom(user_id: number, room_id: number)
    {
        await this.socketGateway.LeaveRoom(user_id, room_id);
        await this.prismaService.user.update({
            where: {
                user_id: user_id,
            },
            data: {
                chatroom_id: null,
            },
        });
        const room = await this.prismaService.chatroom.findUnique({
            where: {
                idx: room_id,
            },
            include: {
                users: true,
            },
        });
        if (room.users.length === 0)
        {
            await this.prismaService.chatroom.delete({
                where: {
                    idx: room_id,
                },
            });
        };
    }
}
