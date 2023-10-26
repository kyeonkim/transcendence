
import { Injectable, Body, StreamableFile } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { addFriendDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { createReadStream } from 'node:fs';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class UserService {
    constructor(
        private readonly httpService: HttpService,
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        ) {}


    async CreateUser(id: number, nickName: string)
    {
        const newUser = await this.prisma.user.create({
            data: {
                user_id: id,
                nick_name: nickName,
            },
        });
        return newUser;
    }
    
    async GetUserDataByNickName(nickName: string)
    {
        console.log("nick_name :", nickName);
        const userData = await this.prisma.user.findUnique({
            where: {
              nick_name: nickName,
            },
        });
        console.log(userData);
        if (userData == null)
            return {status: false, message: "유저 찾기 실패"}
        return {status: true, userData: userData};
    }

    async GetUserDataById(id: number)
    {
        // console.log("user_id :", user_id.user_id);
        const userData = await this.prisma.user.findUnique({
            where: {
              user_id: id,
            },
        });
        console.log("====================User_data=====================\n\n",userData);
        if (userData == null)
            return {status: false, message: "유저 찾기 실패"}
        else
            return Promise.resolve(userData);
    }

    /*
     @return {status: true, message: "success"} 
    */
    async AddFriend(@Body() addFrined : addFriendDto)
    {
        const check =  await this.prisma.friends.findFirst({
            where: {
                following_user_id: addFrined.user_id,
                followed_user_id: addFrined.friend_id,
            },
        });
        if (check !== null)
            return {status: false, message: "already frined"};
        await this.prisma.friends.create({
            data: {
                following_user_id: addFrined.user_id,
                followed_user_id: addFrined.friend_id,
            },
        });
        await this.prisma.friends.create({
            data: {
                following_user_id: addFrined.friend_id,
                followed_user_id: addFrined.user_id,
            },
        });
        return {status: true, message: "success"};
    }
    
    // async DeleteFriend(@Body() addFrined : addFriendDto)
    // {
    //     const check =  await this.prisma.friends.findFirst({
    //         where: {
    //             following_user_id: addFrined.user_id,
    //             followed_user_id: addFrined.friend_id,
    //         },
    //     });
    //     if (check == null)
    //         return {status: false, message: "not frined"};
    //     await this.prisma.friends.delete({
    //         select: {
    //                 following_user_id: addFrined.user_id,
    //                 followed_user_id: addFrined.friend_id,
    //             },
    //         },
    //     });
    //     await this.prisma.friends.delete({
    //         where: {
    //             following_user_id_followed_user_id: {
    //                 following_user_id: addFrined.friend_id,
    //                 followed_user_id: addFrined.user_id,
    //             },
    //         },
    //     });
    //     return {status: true, message: "success"};
    // }

    
    async GetUserImageByNickName(nickName: string)
    {
        if(!fs.existsSync(join(process.cwd(),`./storage/${nickName}`)))
            return new StreamableFile(createReadStream(join(process.cwd(),`./storage/default`)));
        const file = createReadStream(join(process.cwd(),`./storage/${nickName}`));
        return new StreamableFile(file);
    }

}
