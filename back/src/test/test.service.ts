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

@Injectable()
export class TestService {
    constructor(
        private readonly UserService: UserService,
        private readonly GameService: GameService,
        private readonly prisma: PrismaService,
        private readonly SocialService: SocialService,
        private readonly chatService: ChatService,
        private readonly SocketService: SocketGateway,
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


    async CreateDummyUser()
    {
        for(let i = 0; i < 50; i++)
        {
            const user = await this.UserService.GetUserDataById(i);
            if (user.status)
                return {status: false, message: "이미 유저가 존재합니다."};
            await this.UserService.CreateUser(i, `dummy${i}`);
        }
        for(let i = 0; i < 50; i++)
        {
            await this.SocialService.AcceptFriend({user_id: i,user_nickname: `dummy${i}`, friend_nickname: `min`});
            for(let j = 0; j < 50; j++)
            {
                if (i != j)
                    await this.SocialService.AcceptFriend({user_id: i,user_nickname: `dummy${i}`, friend_nickname: `dummy${j}`});
            }
        }
    }

    async DeleteDummyUser()
    {

        for(let i = 0; i < 50; i++)
            await this.DeleteUserByNickName(`dummy${i}`);
    }

    // async CreateDummyGame()
    // {
    //     for(let i = 0; i < 95; i++)
    //         await this.GameService.AddGameData({
    //             rank: true,
    //             user_id: 0,
    //             enemy_id: 1,
    //             my_score: i,
    //             enemy_score: 95 - i
    //         });
    // }

    async DeleteDummyGame()
    {
        try {
            await this.prisma.game.deleteMany({
                where: {
                    user_id: 0,
                },
            });
        }
        catch(error) {
            console.log("Delete DummyGame error: ", error);
        }
        return {status: true, message: "success"};
    }

    async CreateDummyChat()
    {
        for (let i = 0; i < 50; i++)
            await this.chatService.CreateRoom({user_id: i, user_nickname: `dummy${i}`, chatroom_name: `dummy${i} room`, private: false});
    }

    async DeleteDummyChat()
    {
        for(let i = 0; i < 50; i++)
        {
            await this.prisma.chatroom.deleteMany({
                where: {
                    owner_id: i,
                },
            });
        }
        
    }

    async CreateDummyMessage()
    {
        for (let i = 0 ; i < 50; ++i)
        {
            await this.prisma.message.create({
                data: {
                    from_id: 1,
                    to_id: 2,
                    content: `dummy${i} message`,
                }
            })
        }
    }
    
    async SendMessageByID(user_id: number, target_id: number, message: string)
    {
        this.SocketService.SendDMTest(user_id, target_id, message);
    }
}
