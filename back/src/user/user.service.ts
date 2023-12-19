
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
        const user = await this.prisma.user.findUnique({
            where: {
                nick_name: nickName,
            }});
            
        if (user !== null)
            return null;
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
        const userData = await this.prisma.user.findUnique({
            where: {
              nick_name: nickName,
            },
            include: {
                roomuser: {
                    select: {
                        chatroom: {
                            select: {
                                idx: true,
                                name: true,
                                is_private: true,
                                is_password: true,
                            }
                        }
                    }
                },
                blocks : true
            }
        });
        if (userData === null)
            return {status: false, message: "유저 찾기 실패"}
        // 도전 과제 (1승, 10승, 50승) - db 에 넣을수도 있음, 우선 간단하게 작성
        let achievements = [false, false, false];
        if (userData.win >= 1)
            achievements[0] = true;
        if (userData.win >= 10)
            achievements[1] = true;
        if (userData.win >= 50)
            achievements[2] = true;
        return {status: true, userData: userData, achievements: achievements};
    }

    async GetUserDataById(id: number)
    {
        const userData = await this.prisma.user.findUnique({
            where: {
              user_id: id,
            },
            include: {
                roomuser: {
                    select: {
                        chatroom: {
                            select: {
                                idx: true,
                                name: true,
                                is_private: true,
                                is_password: true,
                            }
                        }
                    }
                },
            }
        });
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
