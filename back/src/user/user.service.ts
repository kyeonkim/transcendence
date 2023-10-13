import { Injectable, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { tokenDto } from './dto/token.dto';
import { PrismaService } from '../prisma/prisma.service';
import { createUserDto } from './dto/user.dto';
import { AxiosResponse } from 'axios';

@Injectable()
export class UserService {
	constructor(
        private readonly httpService: HttpService,
        private prisma: PrismaService
    ) {}

    async PostAuth(token : tokenDto) : Promise<boolean>
	{
		const getTokenConfig = {
			url: '/oauth/token/info',
			method: 'get',
			baseURL : 'https://api.intra.42.fr/',
			headers : {'Authorization': `Bearer ${token.access_token}`}
		};
		try {
			const { data } = await firstValueFrom(this.httpService.request(getTokenConfig));
			console.log(data);
			console.log(data.resource_owner_id);
		} catch (error) {
			console.error(error);
		}
		return true;
	}

    async CreateUser(@Body() userData : createUserDto) : Promise<AxiosResponse>
    {
        const user = await this.prisma.user.create({
            data: {
                user_id: 2,
                nick_name: 'Elsa Prisma2',
            },
        });
        const getUser = await this.prisma.user.findMany();
        console.log(getUser);
        const getUserAt = await this.prisma.user.findUnique({
            where: {
              user_id: 2,
            },
        });
        console.log("===========");
        console.log(getUserAt);
        const dummyData = {
            id: 1,
            title: '더미 데이터',
            content: '이것은 더미 데이터 예제입니다.',
        };
        const axiosResponse: AxiosResponse = {
            data: dummyData,
            status: 200,
            statusText: 'OK',
            headers: {
              'Content-Type': 'application/json',
            },
            config: undefined
          };
          return Promise.resolve(axiosResponse);
    }

    async AddFriend(@Body() userData : createUserDto) : Promise<AxiosResponse>
    {
        // const addedfriend1 = await this.prisma.friends.create({
        //     data: {
        //         following_user_id: 1,
        //         followed_user_id: 2,
        //     }
        // });
        // const addedfriend2 = await this.prisma.friends.create({
        //     data: {
        //         following_user_id: 2,
        //         followed_user_id: 1,
        //     }
        // });
        // const addedfriend3 = await this.prisma.friends.create({
        //     data: {
        //         following_user_id: 1,
        //         followed_user_id: 3,
        //     }
        // });
        // const addedfriend4 = await this.prisma.friends.create({
        //     data: {
        //         following_user_id: 3,
        //         followed_user_id: 1,
        //     }
        // });
        const getFriends = await this.prisma.user.findUnique({
            where: {
              user_id: 2,
            },
            include: {
              friends: true, // All posts where authorId == 20
            },
          });
        
        const dummyData = {
            id: 1,
            title: '더미 데이터',
            content: '이것은 더미 데이터 예제입니다.',
        };
        const axiosResponse: AxiosResponse = {
            data: dummyData,
            status: 200,
            statusText: 'OK',
            headers: {
              'Content-Type': 'application/json',
            },
            config: undefined
          };
        console.log(getFriends);
        return Promise.resolve(axiosResponse);
    }
}
