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

    async CheckGameRoom(user_id: number)
    {
        return this.socketGameService.CheckGameRoom(user_id);
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

    async Ready(game_mode: boolean, user_id: number, ready: boolean)
    {
        return this.socketGameService.Ready(game_mode, user_id, ready);
    }

    async Start(user_id: number)
    {
        return this.socketGameService.Start(user_id);
    }

    GetRoomInfo(user_id: number)
    {
        return this.socketGameService.GetRoomInfo(user_id);
    }

    async MatchGame(user_id: number)
    {
        return this.socketGameService.MatchGame(user_id);
    }

    async CancleMatch()
    {
        return this.socketGameService.CancelMatch();
    }

    async ExitGame(user_id: number)
    {
        return this.socketGameService.ExitGame(user_id);
    }
}
