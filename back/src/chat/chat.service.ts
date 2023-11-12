import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto, JoinRoomDto, SetManagerDto } from './dto/chat.dto';
import { SocketGateway } from 'src/socket/socket.gateway';
import { async } from 'rxjs';

@Injectable()
export class ChatService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly socketService: SocketGateway,
    ) {}
    
    async GetRoomList(id: number)
    {
        const rooms = await this.prismaService.chatroom.findMany(
            {
                //코드 작동여부 확인 필요
                where :{
                    is_private: false,
                    NOT: {
                        bans:{
                            some: {
                                user_id: id,
                            },
                        },
                    }
                },
                select: {
                    idx: true,
                    name:true,
                    is_password: true,
                    is_private: true,
                    owner_nickname: true
                },
            }
        );
        return {status: true, message: 'success', rooms: rooms};
    }

    async RoomInfo(room_idx : number)
    {
        const roomInfo = await this.prismaService.chatroom.findUnique({
            where: {
                idx: room_idx,
            },
            include: {
                users: {
                    select: {
                        user_id: true,
                        nick_name: true,
                        is_manager: true,
                    },
                },
            },
        });
        return {status: true, message: 'success', room: roomInfo}
    }

    async CreateRoom(data: CreateRoomDto)
    {
        const room = await this.prismaService.chatroom.create({
            data: {
                owner_id: data.user_id,
                owner_nickname: data.user_nickname,
                name: data.chatroom_name,
                is_private: data.private,
            },
        });
        if (room === undefined)
            return {status: false, message: 'fail to create room'};
        if (data.password !== undefined)
        {
            const password = await this.prismaService.chatroom_password.upsert({
                where: {
                    chatroom_idx: room.idx,
                },
                update: {
                    password: data.password,
                },
                create: {
                    chatroom_idx: room.idx,
                    password: data.password,
                },
            });
            if (password === undefined)
                return {status: false, message: 'fail to create password'};
        }
        const user = await this.prismaService.user.update({
            where: {
                user_id: data.user_id,
            },
            data: {
                chatroom_id: room.idx,
                is_manager: true,
            },
        });
        if (user === undefined)
            return {status: false, message: 'fail to update user'};
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
        await this.socketService.JoinRoom(data.user_id, data.room_id);
    }

    async LeaveRoom(user_id: number, room_id: number)
    {
        await this.socketService.LeaveRoom(user_id, room_id);
        await this.prismaService.user.update({ 
            where: { user_id: user_id },
            data: { chatroom_id: null, is_manager: false },
        });
        const room = await this.prismaService.chatroom.findUnique({
            where: { idx: room_id }, include: { users: true, },
        });
        const users = room.users;
        if (users.length === 0) // 남은 유저가 없을 경우 방을 삭제
        {
            await this.prismaService.chatroom.delete({ where: { idx: room_id } });
            return {status: true, message: 'room deleted'};
        }
        const mannagers = users.filter((user) => user.is_manager === true);
        if (mannagers.length !== 0) // 남은 매니저가 있을경우 그 매니저가 방장이됨
        {
            await this.prismaService.chatroom.update({ 
                where: { idx: room_id }, 
                data: { owner_id: mannagers[0].user_id, owner_nickname: mannagers[0].nick_name } 
            });
        } else { //남은 매니저가 없을경우 가장 먼저 들어온 유저가 방장과 매니저가 됨
            await this.prismaService.chatroom.update({ 
                where: { idx: room_id }, 
                data: { owner_id: users[0].user_id, owner_nickname: users[0].nick_name } 
            });
            await this.prismaService.user.update({ where: { user_id: users[0].user_id }, data: { is_manager: true } });
        }
    }

    async SetManager(data: SetManagerDto)
    {
        const room = await this.prismaService.chatroom.findUnique({
            where: {
                idx: data.room_id,
                users : {
                    some: {
                        user_id: data.user_id,
                    },
                }
            }
        });
        if (room === undefined)
            return {status: false, message: 'fail to find room'};
        await this.prismaService.user.update({
            where: {
                user_id: data.target_id,
            },
            data: {
                is_manager: true,
            },
        });
    }
}
