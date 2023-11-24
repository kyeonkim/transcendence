import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { gameDataDto } from './dto/game.dto';
import { SocketGateway } from 'src/socket/socket.gateway';
import { EventService } from 'src/event/event.service';
import { SocketGameService } from 'src/socket/socket.gameservice';

export class GameRoom {
    constructor(user_id: number)
    {
        this.user1_id = user_id;
    }
    user1_id: number;
    user2_id: number = null;
    user1_ready: boolean = false;
    user2_ready: boolean = false;
}

export class InGameRoom {
    constructor(user_id: number)
    {
        this.user1_id = user_id;
    }
    user1_id: number;
    user2_id: number;
    score1: number;
    score2: number;
}

@Injectable()
export class GameService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly SocketGateway: SocketGateway,
        private readonly eventService: EventService,
        private readonly socketGameService: SocketGameService,
    ) {}

    private gameRoomMap = new Map<number, GameRoom>();
    private gameMatchQue = new Array<number>();
    private InGame = new Map<number, InGameRoom>();

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

    async CreateGameRoom(user_id: number)
    {
        return this.socketGameService.CreateGameRoom(user_id);
    }

    async JoinGameRoom(user1_id: number, user2_id: number, event_id: number)
    {
        return this.socketGameService.JoinGameRoom(user1_id, user2_id, event_id);
    }

    async LeaveGameRoom(user_id: number)
    {
        return this.socketGameService.LeaveGameRoom(user_id);
    }

    async InviteGameRoom(user_id: number, target_id: number, user_nicknmae: string)
    {
        return this.socketGameService.InviteGameRoom(user_id, target_id, user_nicknmae);
    }

    async Ready(user_id: number, ready: boolean)
    {
        return this.socketGameService.Ready(user_id, ready);
    }

    async Start(user_id: number)
    {
        return this.socketGameService.Start(user_id);
    }

    GetRoomInfo(user_id: number)
    {
        return this.socketGameService.GetRoomInfo(user_id);
    }

}
