import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { addFriendDto } from 'src/user/dto/user.dto';

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

    /*
     @return {status: true, message: "success"} 
    */
   
    async AddFriend(@Body() addFrined : addFriendDto)
    {
        const check =  await this.prismaService.friends.findFirst({
            where: {
                following_user_id: addFrined.user_id,
                followed_user_id: addFrined.friend_id,
            },
        });
        if (check !== null)
            return {status: false, message: "already frined"};
        await this.prismaService.friends.create({
            data: {
                following_user_id: addFrined.user_id,
                followed_user_id: addFrined.friend_id,
            },
        });
        await this.prismaService.friends.create({
            data: {
                following_user_id: addFrined.friend_id,
                followed_user_id: addFrined.user_id,
            },
        });
        return {status: true, message: "success"};
    }
    
    // async DeleteFriend(@Body() addFrined : addFriendDto)
    // {
    //     const check =  await this.prismaService.friends.findFirst({
    //         where: {
    //             following_user_id: addFrined.user_id,
    //             followed_user_id: addFrined.friend_id,
    //         },
    //     });
    //     if (check == null)
    //         return {status: false, message: "not frined"};
    //     await this.prismaService.friends.delete({
    //         select: {
    //                 following_user_id: addFrined.user_id,
    //                 followed_user_id: addFrined.friend_id,
    //             },
    //         },
    //     });
    //     await this.prismaService.friends.delete({
    //         where: {
    //             following_user_id_followed_user_id: {
    //                 following_user_id: addFrined.friend_id,
    //                 followed_user_id: addFrined.user_id,
    //             },
    //         },
    //     });
    //     return {status: true, message: "success"};
    // }
}
