import { Injectable, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IntraTokenDto, UserTokenDto } from './dto/token.dto';
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

        
    async CreateToken(user_id: number)
    {
        const payload = { user_id: user_id, created_at: new Date() };
        const user_token = await this.prisma.tokens.upsert({
            where: {
                tokens_user_id: user_id
            },
            update: {
                access_token: await this.jwtService.signAsync(payload),
                refresh_token:await this.jwtService.signAsync(payload),
            },
            create: {
                tokens_user_id: user_id,
                access_token: await this.jwtService.signAsync(payload),
                refresh_token:await this.jwtService.signAsync(payload),
            },
        });
        console.log(user_token);
        if (user_token == null)
            return {status: false, message: "토큰 발급 실패"}
        else
            return {status: true, message: "토큰 발급 성공", data: user_token}
    }

    // async ReCreateToken(token: UserTokenDto)
    // {
    //     //0. token 디코딩
    //     try {

    //     }
    //     //1. access토큰이 만료가 되었고
    //     //2. 우리가 최근에 발급한 access 토큰이고
    //     //3. refresh 토큰이 만료가 되지않았고
    //     //4. refresh 토큰이 일치하면 -> 재발급 하나라도 아니면 로그아웃.
    //     // if( )//userid와 refresh_token 일치여부 확인
    //     // return await this.CreateToken(token.user_id);// 새토큰 발급
    // }

    async PostAuth(token : IntraTokenDto)
	{
		const getTokenConfig = {
			url: '/oauth/token/info',
			method: 'get',
			baseURL : 'https://api.intra.42.fr/',
			headers : {'Authorization': `Bearer ${token.access_token}`}
		};
		try {
			const { data } = await firstValueFrom(this.httpService.request(getTokenConfig));
            const userData = await this.prisma.user.findUnique({
                where: {
                  user_id: data.resource_owner_id,
                },
            });
            if (userData === null)
                return {sign: false, access_token: token.access_token};
            else // access_token 발급 refresh_token 발급
                return {sign: true, userdata: this.GetUserDataById(userData.user_id)}
		} catch (error) {
            console.error(error);
		}
	}

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
