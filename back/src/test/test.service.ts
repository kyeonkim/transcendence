import { Injectable } from '@nestjs/common';
import { gameDataDto } from 'src/game/dto/game.dto';
import { UserService } from 'src/user/user.service';
import { GameService } from 'src/game/game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class TestService {
    constructor(
        private readonly UserService: UserService,
        private readonly GameService: GameService,
        private readonly prisma: PrismaService,
    ) {}

    async DeleteUserById(nickName: string)
    {
        const user = await this.prisma.user.findUnique({
            where: {
              nick_name: nickName,
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
                nick_name: nickName,
            },
        });
        await this.prisma.user.delete({
            where: {
                user_id: id,
            },
        });
        if(fs.existsSync(join(process.cwd(),`./storage/${nickName}`)))
            fs.unlinkSync(join(process.cwd(),`./storage/${nickName}`));
        return {status: true, message: "success", delete_user: user.nick_name};
    }


    async CreateDummyUser()
    {
        for(let i = 0; i < 10; i++)
            this.UserService.CreateUser(i, `dummy${i}`);
        for(let i = 0; i < 10; i++)
        {
            for(let j = 0; j < 10; j++)
            {
                if (i != j)
                    this.UserService.AddFriend({user_id: i, friend_id: j});
            }
        }
    }

    async CreateDummyGame()
    {
        for(let i = 0; i < 40; i++)
            await this.GameService.AddGameData({
                rank: true,
                user_id: 0,
                enemy_id: 1,
                my_score: i,
                enemy_score: 40 - i
            });
    }

    async DeleteDummyGame()
    {
        try {
            await this.prisma.game.deleteMany({
                where: {
                    user_id: 0,
                },
            });
        }
        catch(error) {
            console.log("Delete DummyGame error: ", error);
        }
        return {status: true, message: "success"};
    }
}
