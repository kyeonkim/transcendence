import { Injectable, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IntraTokenDto, UserTokenDto } from '../auth/dto/token.dto';
import { PrismaService } from '../prisma/prisma.service';
import { createUserDto, getUserDto, addFriendDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        private readonly httpService: HttpService,
        private prisma: PrismaService,
        private jwtService: JwtService
        ) {}


    async GetUserDataByNickName(nickname: string)
    {
        console.log("nick_name :", nickname);
        const userData = await this.prisma.user.findUnique({
            where: {
              nick_name: nickname,
            },
        });
        console.log(userData);
        return await Promise.resolve(userData);
    }

    async GetUserDataById(id: number)
    {
        // console.log("user_id :", user_id.user_id);
        const userData = await this.prisma.user.findUnique({
            where: {
              user_id: id,
            },
        });
        console.log(userData);
        if (userData == null)
            return {status: false, message: "유저 찾기 실패"}
        else
            return await Promise.resolve(userData);
    }

    async CreateUser(@Body() userData : createUserDto)
    {
        const getTokenConfig = {
			url: '/oauth/token/info',
			method: 'get',
			baseURL : 'https://api.intra.42.fr/',
			headers : {'Authorization': `Bearer ${userData.access_token}`}
		};
		const { data } = await firstValueFrom(this.httpService.request(getTokenConfig));
        const user = await this.prisma.user.create({
            data: {
                user_id: data.resource_owner_id,
                nick_name: userData.nick_name,
                img_name: userData.img_name,
            },
        });
        //닉네임중복체크
        return {status: true, message: "success"};
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
}
