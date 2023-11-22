import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { gameDataDto } from './dto/game.dto';

export class gameRoom {
    user_id: number;
    enemy_id: number;
}

@Injectable()
export class GameService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    async AddGameData(gameData: gameDataDto)
    {
        const isWin : boolean = gameData.my_score > gameData.enemy_score ? true : false;
        try {
            const enemy = await this.prismaService.user.findUnique({
                where: {
                    user_id: gameData.enemy_id,
                },
            });
            await this.prismaService.game.create({
                data: {
                    rank: gameData.rank,
                    user_id: gameData.user_id,
                    enemy_id: gameData.enemy_id,
                    enemy_name: enemy.nick_name,
                    winner: isWin,
                    my_score: gameData.my_score,
                    enemy_score: gameData.enemy_score,
                },
            });
            await this.prismaService.game.create({
                data: {
                    rank: gameData.rank,
                    user_id: gameData.enemy_id,
                    enemy_id: gameData.user_id,
                    enemy_name: enemy.nick_name,
                    winner: !isWin,
                    my_score: gameData.enemy_score,
                    enemy_score: gameData.my_score,
                },
            }); 
        } catch (error) {
            console.log("error: ", error);
        }
    }

    async GetGameDataById(id: number, index: number)
    {
        const user = await this.prismaService.user.findUnique({
            where: {
              user_id: id,
            },
            include: {
                games: {
                    cursor: index ? { idx: index } : undefined,
                    take: 10,
                    skip: 0,
                    orderBy: { idx: 'desc'},
                },
            },
        });
        if (user === null || user.games.length == 0)
            return {status: false, message: "게임 데이터 찾기 실패"};
        return {status: true, data: user.games};
    }
}
