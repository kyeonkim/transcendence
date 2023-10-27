import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { friendDto } from 'src/user/dto/user.dto';

@Injectable()
export class SocialService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    async CheckFriend(user1_id: number, user2_name: string)
    {
        const user2 = await this.prismaService.user.findUnique({
            where: {
                nick_name: user2_name,
            },
        });
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
                nick_name: addFriend.friend_nick_name,
            },
        });
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
                    followed_user_id: friend.user_id,
                },
            });
            await this.prismaService.friends.create({
                data: {
                    following_user_id: friend.user_id,
                    followed_user_id: addFriend.user_id,
                },
            });
        } catch (error) {
            console.log("AddFriend failed error: ", error);
            return {status: false, message: "AddFriend failed"}
        }
        return {status: true, message: "success"};
    }
    
    async DeleteFriend(@Body() delFriend : friendDto)
    {
        const friend = await this.prismaService.user.findUnique({
            where: {
                nick_name: delFriend.friend_nick_name,
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
        return {status: true, message: "success"};
    }

    async GetFriendList(id: number)
    {
        const frinedList = await this.prismaService.friends.findMany({
            where: {
                following_user_id: id,
            },
        });
        if (!frinedList.length)
            return {status: false, message: "친구목록 없음" };
        return {status: true, data: frinedList};
    }
}
