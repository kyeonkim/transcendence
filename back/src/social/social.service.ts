import { Body, Injectable } from '@nestjs/common';
import { EventService } from 'src/event/event.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { friendDto } from './dto/social.dto';

@Injectable()
export class SocialService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly eventService: EventService
    ) {}

    async CheckFriend(user1_id: number, user2_name: string)
    {
        const user2 = await this.prismaService.user.findUnique({
            where: {
                nick_name: user2_name,
            },
        });
        if (user2 === null)
            return {status: false, message: "not found user"};
        const frined = await this.prismaService.friends.findFirst({
            where: {
                following_user_id: user1_id,
                followed_user_id: user2.user_id,
            },
        },);
        if (frined === null)
            return {status: false, message: "친구 아님"};
        return {status: true, message: "친구"};
    }
   
    async AddFriend(@Body() addFriend : friendDto)
    {
        const friend = await this.prismaService.user.findUnique({
            where: {
                nick_name: addFriend.friend_nickname,
            },
        });
        if (friend === null)
            return {status: false, message: "not found friend"}
        const check =  await this.prismaService.friends.findFirst({
            where: {
                following_user_id: addFriend.user_id,
                followed_user_id: friend.user_id,
            },
        });
        if (check !== null)
            return {status: false, message: "already frined"};
        // try 
        // {
        //     await this.prismaService.friends.create({
        //         data: {
        //             following_user_id: addFriend.user_id,
        //             followed_user_id: friend.user_id,
        //         },
        //     });
        //     await this.prismaService.friends.create({
        //         data: {
        //             following_user_id: friend.user_id,
        //             followed_user_id: addFriend.user_id,
        //         },
        //     });
        // } catch (error) {
        //     console.log("AddFriend failed error: ", error);
        //     return {status: false, message: "AddFriend failed"}
        // }
        const sent_res = await this.eventService.SendEvent({
            to: friend.user_id,
            type: "add_friend",
            from: addFriend.user_nickname,
            chatroom_id: 0,
            chatroom_name: "",
        })
        return {status: sent_res.status, message: sent_res.message};
    }

    async AcceptFriend(@Body() addFriend : friendDto)
    {
        await this.eventService.DeleteAlarms(addFriend.event_id);
        const friend = await this.prismaService.user.findUnique({
            where: {
                nick_name: addFriend.friend_nickname,
            },
        });
        if (friend === null)
            return {status: false, message: "frined user not found"};
        const check =  await this.prismaService.friends.findFirst({
            where: {
                following_user_id: addFriend.user_id,
                followed_user_id: friend.user_id,
            },
        });
        if (check !== null)
            return {status: false, message: "already frined"};
        try 
        {
            await this.prismaService.friends.create({
                data: {
                    following_user_id: addFriend.user_id,
                    following_user_nickname: addFriend.user_nickname,
                    followed_user_id: friend.user_id,
                    followed_user_nickname: friend.nick_name,
                },
            });
            await this.prismaService.friends.create({
                data: {
                    following_user_id: friend.user_id,
                    following_user_nickname: friend.nick_name,
                    followed_user_nickname: addFriend.user_nickname,
                    followed_user_id: addFriend.user_id,
                },
            });
        } catch (error) {
            console.log("AddFriend failed error: ", error);
            return {status: false, message: "AddFriend failed"}
        }
        await this.eventService.SendFriendEvent(addFriend.user_id);
        await this.eventService.SendFriendEvent(friend.user_id);
        return {status: true, message: "success"};
    }
    
    async DeleteFriend(@Body() delFriend : friendDto)
    {
        const friend = await this.prismaService.user.findUnique({
            where: {
                nick_name: delFriend.friend_nickname,
            },
        });
        const check = await this.prismaService.friends.findFirst({
            where: {
                following_user_id: delFriend.user_id,
                followed_user_id: delFriend.friend_id,
            },
        });
        if (check === null)
            return {status: false, message: "not frined"};
        try {
            await this.prismaService.friends.deleteMany({
                where: { following_user_id: friend.user_id,
                    followed_user_id: delFriend.user_id, },
            },);
            await this.prismaService.friends.deleteMany({
                where: { following_user_id: delFriend.user_id,
                    followed_user_id: friend.user_id },
            },);
        }
        catch (error) {
            console.log("DeleteFriend failed error: ", error);
            return {status: false, message: "DeleteFriend failed"}
        }
        await this.eventService.SendFriendEvent(delFriend.user_id);
        await this.eventService.SendFriendEvent(friend.user_id);
        return {status: true, message: "success"};
    }

    async GetFriendList(id: number)
    {
        const frinedList = await this.prismaService.friends.findMany({
            where: {
                following_user_id: id,
            },
            select: {
                followed_user_nickname: true,
                followed_user_id: true,
            },
        });
        if (!frinedList.length)
            return {status: false, message: "친구목록 없음" };
        return {status: true, data: frinedList};
    }
}
