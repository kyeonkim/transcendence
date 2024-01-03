import { Injectable } from '@nestjs/common';
import { gameDataDto } from 'src/game/dto/game.dto';
import { UserService } from 'src/user/user.service';
import { GameService } from 'src/game/game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocialService } from 'src/social/social.service';
import * as fs from 'fs';
import { join } from 'path';
import { ChatService } from 'src/chat/chat.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TestService {
    constructor(
        private readonly UserService: UserService,
        private readonly GameService: GameService,
        private readonly prisma: PrismaService,
        private readonly SocialService: SocialService,
        private readonly chatService: ChatService,
        private readonly SocketService: SocketGateway,
        private readonly AuthService: AuthService,
    ) {}

    async DeleteUserByNickName(nickName: string)
    {
        const user = await this.prisma.user.findUnique({
            where: {
              nick_name: nickName,
            },
            include:{
                twoFA_key: true,
                roomuser: true,
                friends: true,
                games: true,
                tokens: true,
                events: true,
                blocks: true,
                recv_messages: true,
                send_messages: true,
            }
        });
        if (user === null)
            return {status: false, message: "유저 찾기 실패"}
        const id = user.user_id;
        if (user.friends.length > 0)
        {
            await this.prisma.friends.deleteMany({
                where: {
                    OR: [
                        {
                            following_user_id: id,
                        },
                        {
                            followed_user_id: id,
                        },
                    ],
                },
            });
        }
        if (user.tokens !== null)
        {
            await this.prisma.tokens.deleteMany({
                where: {
                    nick_name: nickName,
                },
            });
        }
        if (user.games.length > 0)
        {
            await this.prisma.game.deleteMany({
                where: {
                    OR: [
                        {
                            user_id: id,
                        },
                        {
                            enemy_id: id,
                        },
                    ],
                },
            });
        }
        if (user.events.length > 0)
        {
            await this.prisma.event.deleteMany({
                where: {
                    to_id: id,
                },
            });
        }
        if (user.send_messages.length > 0 || user.recv_messages.length > 0)
        {
            await this.prisma.message.deleteMany({
                where: {
                    OR: [
                        {
                            from_id: id,
                        },
                        {
                            to_id: id,
                        },
                    ],
                },
            });
        }
        if (user.roomuser !== null)
            await this.chatService.LeaveRoom({user_id: id, user_nickname: nickName, room_id: user.roomuser.chatroom_id});
        if (user.blocks.length > 0)
            await this.prisma.block.deleteMany({ where: { user_id: id } });
        await this.prisma.user.delete({
            where: {
                user_id: id,
            },
        });
        if(fs.existsSync(join(process.cwd(),`./storage/${nickName}`)))
            fs.unlinkSync(join(process.cwd(),`./storage/${nickName}`));
        return {status: true, message: "success", delete_user: user.nick_name};
    }

    async SendMessageByID(user_id: number, target_id: number, message: string)
    {
        this.SocketService.SendDMTest(user_id, target_id, message);
    }
}
