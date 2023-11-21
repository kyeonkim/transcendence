import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatRoomDto, InviteChatDto, JoinRoomDto, SetChatUserDto } from './dto/chat.dto';
import { SocketGateway } from 'src/socket/socket.gateway';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EventService } from 'src/event/event.service';
import { eventDto } from 'src/event/dto/event.dto';

@Injectable()
export class ChatService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly socketService: SocketGateway,
        private readonly jwtService: JwtService,
        private readonly eventService: EventService,
    ) {}
    
    async GetRoomList(id: number)
    {
        console.log("GetRoomList: ", id);
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
            select: {
                idx: true,
                name: true,
                is_password: true,
                is_private: true,
                owner_id: true,
                owner_nickname: true,
                roomusers: {
                    select: {
                        user_id: true,
                        user_nickname: true,
                        is_manager: true,
                    },
                },    
            },
        });
        return {status: true, message: 'success', room: roomInfo}
    }
    
    async CreateRoom(data: ChatRoomDto)
    {
        const room = await this.prismaService.chatroom.create({
            data: {
                owner_id: data.user_id,
                owner_nickname: data.user_nickname,
                name: data.chatroom_name,
                is_private: data.private,
            },
        });
        if (room === null)
        return {status: false, message: 'fail to create room'};
        if (data.password !== undefined)
        {
            const password = await this.prismaService.chatroom.update({
                where: {
                    idx: room.idx,
                },
                data: {
                    is_password: true,
                    room_password: data.password,
                },
            });
            if (password === null)
                return {status: false, message: 'fail to create password'};
        }
        const user = await this.prismaService.chatroom_user.create({
            data: {
                user_id: data.user_id,
                user_nickname: data.user_nickname,
                chatroom_id: room.idx,
                is_manager: true,
            }
        });
        if (user === null)
            return {status: false, message: 'fail to update user'};
        await this.socketService.JoinRoom(data.user_id, `chat-${room.idx}`);
        await this.socketService.SendRerenderAll("chat");
        return {status: true, message: 'success', room: room};
    }

    async ChangeRoom(room: ChatRoomDto)
    {
        const chatroom = await this.prismaService.chatroom.findUnique({
            where: {
                idx: room.room_idx,
            },
        });
        if (chatroom === null)
            return {status: false, message: 'fail to find room'};
        const ChangeRoom = await this.prismaService.chatroom.update({
            where: {
                idx: room.room_idx,
            },
            data: {
                name: room.chatroom_name,
                is_private: room.private,
            },
        });
        if (ChangeRoom === null)
            return {status: false, message: 'fail to change room'};
        return {status: true, message: 'success'};
    }
    
    async JoinRoom(data: JoinRoomDto)
    {
        const chatuser = await this.prismaService.chatroom_user.findUnique({
            where: { user_id: data.user_id, }
        });
        if (chatuser !== null)
            return {status: false, message: 'already joined room'};
        const room = await this.prismaService.chatroom.findUnique({
            where: { idx: data.room_id },
        });
        if (room === null)
            return {status: false, message: 'fail to find room'};
        if (room.is_password)
        {
            if (bcrypt.compareSync(data.password, room.room_password) !== true)
                return {status: false, message: 'password is invaild'}
        }
        await this.prismaService.chatroom_user.create({
            data: {
                chatroom_id: data.room_id,
                user_id: data.user_id,
                user_nickname: data.user_nickname,
            },
        });
        await this.socketService.JoinRoom(data.user_id, `chat-${data.room_id}`);
        return {status: true, message: 'success'};
    }

    async LeaveRoom(data: JoinRoomDto)
    {
        await this.socketService.LeaveRoom(data.user_id, `chat-${data.room_id}`);
        await this.prismaService.chatroom_user.delete({ where: { user_id: data.user_id }});
        const room = await this.prismaService.chatroom.findUnique({
            where: { idx: data.room_id }, include: { roomusers: true, },
        });
        if (room.owner_id === data.user_id)
        {
            await this.socketService.DeleteRoom(data.room_id);
            await this.prismaService.chatroom_user.deleteMany({
                where : {
                    chatroom_id: data.room_id,
                },
            });
            await this.prismaService.chatroom.delete({ where: { idx: data.room_id } });
        }
        return {status: true, message: 'success'};
        // const users = room.roomusers;
        // if (users.length === 0) // 남은 유저가 없을 경우 방을 삭제
        // {
        //     await this.prismaService.chatroom.delete({ where: { idx: data.room_id } });
        //     return {status: true, message: 'room deleted'};
        // }
        // const mannagers = users.filter((user) => user.is_manager === true);
        // if (mannagers.length !== 0) // 남은 매니저가 있을경우 그 매니저가 방장이됨
        // {
        //     await this.prismaService.chatroom.update({ 
        //         where: { idx: data.room_id }, 
        //         data: { owner_id: mannagers[0].user_id, owner_nickname: mannagers[0].user_nickname } 
        //     });
        // } else { //남은 매니저가 없을경우 가장 먼저 들어온 유저가 방장과 매니저가 됨
        //     await this.prismaService.chatroom.update({ 
        //         where: { idx: data.room_id }, 
        //         data: { owner_id: users[0].user_id, owner_nickname: users[0].user_nickname } 
        //     });
        //     await this.prismaService.chatroom_user.update({ where: { user_id: users[0].user_id }, data: { is_manager: true } });
        // }
    }

    async SetManager(data: SetChatUserDto)
    {
        const room = await this.prismaService.chatroom.findUnique({
            where: {
                idx: data.room_id,
                roomusers : {
                    some: {
                        user_id: data.user_id,
                    },
                }
            }
        });
        if (room === undefined)
            return {status: false, message: 'fail to find room'};
        await this.prismaService.chatroom_user.update({
            where: {
                user_id: data.target_id,
            },
            data: {
                is_manager: true,
            },
        });
        this.socketService.HandleNotice(data.room_id, `${data.target_nickname}님이 매니저가 되었습니다.`);
        return {status: true, message: 'success'};
    }

    async UnsetManager(data: SetChatUserDto)
    {
        const room = await this.prismaService.chatroom.findUnique({
            where: {
                idx: data.room_id,
                roomusers : {
                    some: {
                        user_id: data.user_id,
                    },
                }
            }
        });
        if (room === undefined)
            return {status: false, message: 'fail to find room'};
        await this.prismaService.chatroom_user.update({
            where: {
                user_id: data.target_id,
            },
            data: {
                is_manager: false,
            },
        });
        return {status: true, message: 'success'};
    }

    async MuteUser(data: SetChatUserDto)
    {
        const room = await this.prismaService.chatroom.findUnique({
            where: {
                idx: data.room_id,
                roomusers : {
                    some: {
                        user_id: data.user_id,
                    },
                }
            }
        });
        if (room === undefined)
            return {status: false, message: 'fail to find room'};
        await this.prismaService.chatroom_user.update({
            where: {
                user_id: data.target_id,
            },
            data: {
                is_mute: true,
                mute_time: String(new Date().valueOf() + 30000),
            }
        });
        await this.socketService.HandleNotice(data.room_id, `${data.target_nickname}님이 채팅을 금지당하셨습니다.`);
        return {status: true, message: 'success'};
    }

    async UnmuteUser(data: SetChatUserDto)
    {
        const room = await this.prismaService.chatroom.findUnique({
            where: {
                idx: data.room_id,
                roomusers : {
                    some: {
                        user_id: data.user_id,
                    },
                }
            }
        });
        if (room === null)
            return {status: false, message: 'fail to find room'};
        await this.prismaService.chatroom_user.update({
            where: {
                user_id: data.target_id,
            },
            data: {
                is_mute: false,
                mute_time: null,
            }
        });
        return {status: true, message: 'success'};
    }

    async BanUser(data: SetChatUserDto)
    {
        const room = await this.prismaService.chatroom.findUnique({
            where: {
                idx: data.room_id,
                roomusers : {
                    some: {
                        user_id: data.user_id,
                    },
                }
            }
        });
        if (room === null)
            return {status: false, message: 'fail to find room'};
        await this.prismaService.ban.create({
            data: {
                user_id: data.target_id,
                chatroom_id: data.room_id,
            }
        });
        await this.KickUser(data);
        await this.socketService.HandleNotice(data.room_id, `${data.target_nickname}님이 영구퇴장 당하셨습니다.`);
        return {status: true, message: 'success'};
    }

    async UnbanUser(data: SetChatUserDto)
    {
        const room = await this.prismaService.chatroom.findUnique({
            where: {
                idx: data.room_id,
                bans : {
                    some: {
                        user_id: data.user_id,
                    },
                }
            }
        });
        if (room === null)
            return {status: false, message: 'fail to find room'};
        await this.prismaService.ban.deleteMany({
            where: {
                user_id: data.target_id,
                chatroom_id: data.room_id,
            }
        });
        return {status: true, message: 'success'};
    }

    async CheckPassword(data: JoinRoomDto)
    {
        const room = await this.prismaService.chatroom.findUnique({
            where: {
                idx: data.room_id,
            },
        });
        if (room === null)
            return {status: false, message: 'fail to find room'};
        if (room.is_password === false)
            return {status: true, message: 'no password'};
        if (room.room_password !== data.password)
            return {status: false, message: 'wrong password'};
        return {status: true, message: 'success'};
    }

    async KickUser(data: SetChatUserDto)
    {
        const room = await this.prismaService.chatroom.findUnique({
            where: {
                idx: data.room_id,
                roomusers : {
                    some: {
                        user_id: data.user_id,
                    },
                }
            }
        });
        if (room === null)
            return {status: false, message: 'fail to find room'};
        await this.socketService.HandleNotice(data.room_id, `${data.target_nickname}님이 강제퇴장 당하셨습니다.`);
        await this.socketService.HandleKick(data.target_id, data.room_id);
        this.LeaveRoom({user_id: data.target_id, user_nickname: data.target_nickname, room_id: data.room_id});
        return {status: true, message: 'success'};
    }

    async GetMyRoomByHeader(headers: any)
    {
        const [type, token] = headers.authorization?.split(' ') ?? [];
        console.log(`type : ${type}, token : ${token}`);
        const payload = this.jwtService.decode(token);

        const room = await this.prismaService.chatroom_user.findUnique({
            where: {
                user_id: payload['user_id']
            },
            include :{
                chatroom: true,
            }
        });
        return room;
    }

    async InviteUser(data: InviteChatDto)
    {
        const user = await this.prismaService.user.findUnique({ where: { nick_name: data.to } });
        if (user === null)
            return {status: false, message: "Can't friend"};
        const eventData: eventDto = 
        {
            to: user.user_id,
            type: data.type,
            from: data.from,
            chatroom_id: data.chatroom_id,
            chatroom_name: data.chatroom_name
        };
        return await this.eventService.SendEvent(eventData)
    }

    async AcceptInvite(data: JoinRoomDto)
    {
        const event = await this.prismaService.event.findFirst({
            where: {
                to_id: data.user_id,
                event_type: 'invite_chat',
                chatroom_id: data.room_id,
            },
        });
        if (event === null || event.idx !== data.event_id)
            return {status: false, message: 'fail to find event'};
        await this.prismaService.event.delete({
            where: {
                idx: event.idx,
            },
        });
        return await this.JoinRoom(data);
    }

    async GetDm(idx: number, user_id: number, from_id: number)
    {
        const dm = await this.prismaService.message.findMany({
            where: {
                OR: [
                    {
                        from_id: user_id,
                        to_id: from_id,
                    },
                    {
                        from_id: from_id,
                        to_id: user_id,
                    }
                ]
            },
            cursor: idx ? { idx: idx } : undefined,
            take: 30,
            skip: 0,     
            orderBy: { idx: 'desc'},
        });
        if (dm === null)
            return {status: false, message: 'fail to find dm'}
        return {status: true, message: 'success', dm: dm};
    }

    async GetUnreadDm(user_id: number, from_id: number)
    {
        try {
            const unreaddm = await this.prismaService.message.findMany({
                where: {
                    from_id: from_id,
                    to_id: user_id,
                    is_read: false,
                },
                orderBy: { idx: 'desc' } 
            });
            if (unreaddm === null)
                return {status: true, dm: []};
            const dm = await this.prismaService.message.updateMany({
                where: {
                    from_id: from_id,
                    to_id: user_id,
                    is_read: false,
                },
                data: {
                    is_read: true,
                },
            });
            return {status: true, dm: unreaddm};
        } catch (error) {
            console.log(error);
            return {status: false, message: 'fail to update dm'};
        }
    }
}
