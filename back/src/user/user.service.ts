
import { Injectable, Body, Inject, forwardRef } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from '../auth/dto/token.dto';
import { createUserDto, getUserDto, addFriendDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        private readonly httpService: HttpService,
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
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
        console.log("====================User_data=====================\n\n",userData);
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
        const newUser = await this.prisma.user.create({
            data: {
                user_id: data.resource_owner_id,
                nick_name: userData.nick_name,
                img_name: userData.img_name,
            },
        });
        console.log("newUser ====\n\n",newUser);
        //닉네임중복체크
        if (newUser == null)
            return {status: false, message: "이미 사용 중인  이름입니다."};
        else
        {
            const tokenData = await this.authService.CreateToken(newUser.user_id);
            return {status: true,  message: "success", userdata: newUser, token: tokenData};
        }
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

    async DeleteUserById(nickname: string)
    {
        const user = await this.prisma.user.findUnique({
            where: {
              nick_name: nickname,
            },
        });
        if (user == null)
            return {status: false, message: "유저 찾기 실패"}
        const id = user.user_id;

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
        await this.prisma.tokens.deleteMany({
            where: {
                tokens_user_id: id,
            },
        });
        await this.prisma.user.delete({
            where: {
                user_id: id,
            },
        });
        return {status: true, message: "success", delete_user: user.nick_name};
    }
}


