
import { Injectable, Body, StreamableFile } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
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
        if (userData === null)
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
            return {status: true, userdata: userData};
    }

    
    async GetUserImageByNickName(nickName: string)
    {
        if(!fs.existsSync(join(process.cwd(),`./storage/${nickName}`)))
            return new StreamableFile(createReadStream(join(process.cwd(),`./storage/default`)));
        const file = createReadStream(join(process.cwd(),`./storage/${nickName}`));
        return new StreamableFile(file);
    }

}
