import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { gameDataDto } from './dto/game.dto';

@Injectable()
export class GameService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    async AddGameData(gameData: gameDataDto)
    {
        const isWin : boolean = gameData.my_score > gameData.enemy_score ? true : false;
        try {
            await this.prismaService.game.create({
                data: {
                    rank: gameData.rank,
                    user_id: gameData.user_id,
                    enemy_id: gameData.enemy_id,
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
                    take: -10,
                    skip: 0
                },
            },
        });
        if (user.games.length == 0)
            return {status: false, message: "게임 데이터 찾기 실패"};
        return {status: true, data: user.games.reverse()};
    }
}
