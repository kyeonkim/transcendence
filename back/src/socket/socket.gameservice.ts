import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { SocketService } from "./socket.service";
import { EventService } from "src/event/event.service";
import { PrismaService } from "src/prisma/prisma.service";

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
    game_mode: boolean = false;
    user1_id: number;
    user2_id: number;
    user1_nickname: string;
    user2_nickname: string;
    user1_ready: boolean = false;
    user2_ready: boolean = false;
    user1_position: number;
    user2_position: number;
    score1: number;
    score2: number;
}

@Injectable()
export class SocketGameService {
    private server: Server;
    constructor(
        private readonly SocketService: SocketService,
        private readonly eventService: EventService,
        private readonly prismaservice: PrismaService,
    ){}
    private gameRoomMap = new Map<number, GameRoom>();
    private gameMatchQue = new Array<number>();
    private InGame = new Map<number, InGameRoom>();

    setServer(server: Server) {
      this.server = server;
    }

    async CheckGameRoom(user_id: number)
    {
        if (this.gameRoomMap.get(user_id) !== undefined)
        {
            this.server.to(String(user_id)).emit(`render-gameroom`, {status: 'gameroom', room: this.gameRoomMap.get(user_id)});
            return {status: true, message: "게임방이 존재합니다."};
        } else if (this.InGame.get(user_id) !== undefined) {
            this.server.to(String(user_id)).emit(`render-gameroom`, {status: 'ingame', room: this.InGame.get(user_id)});
            return {status: true, message: "게임 중입니다."};
        } else if (this.gameMatchQue.includes(user_id)) {
            this.server.to(String(user_id)).emit(`render-gameroom`, {status: 'matching', room: user_id});
            return {status: true, message: "매칭 중입니다."};
        }
        return {status: false, message: "게임방이 없습니다."};
    }

    async CreateGameRoom(user_id: number)
    {
        if (this.gameRoomMap.get(user_id) !== undefined)
        {
            this.server.to(String(user_id)).emit(`render-gameroom`, {status: 'gameroom', room: this.gameRoomMap.get(user_id)});
            return {status: false, message: "이미 게임방이 존재합니다."};
        }
        this.gameRoomMap.set(user_id, new GameRoom(user_id));
        this.server.to(String(user_id)).emit(`render-gameroom`, {status: 'gameroom', room: this.gameRoomMap.get(user_id)});
        return {status: true, message: "게임방 생성 성공"};
    }

    async JoinGameRoom(user1_id: number, user2_id: number, event_id: number)
    {
        if (this.gameRoomMap.get(user1_id) === undefined)
            return {status: false, message: "게임방이 존재하지 않습니다."};
        const room = this.gameRoomMap.get(user1_id);
        if(!room || room.user2_id)
            return {status: false, message: "초대가 만료되었습니다."};
        room.user2_id = user2_id;
        this.gameRoomMap.set(user2_id, room);
        this.server.to(String(user1_id)).emit(`render-gameroom`, {status: 'gameroom', room: this.gameRoomMap.get(user1_id)});
        this.server.to(String(user2_id)).emit(`render-gameroom`, {status: 'gameroom', room: this.gameRoomMap.get(user2_id)});
        this.eventService.DeleteAlarms(event_id);
        return {status: true, message: "게임방 참가 성공"};
    }

    async LeaveGameRoom(user_id: number)
    {
        if (this.gameRoomMap.get(user_id) === undefined)
            return {status: false, message: "게임방이 존재하지 않습니다."};
        const room = this.gameRoomMap.get(user_id);
        const user2 = room.user2_id;
        if (room.user1_id === user_id)
        {
            this.gameRoomMap.delete(room.user1_id);
            room.user1_id = null;
            room.user1_ready = false;
        }
        this.gameRoomMap.delete(user2);
        room.user2_id = null;
        room.user2_ready = false;
        console.log(this.gameRoomMap);
        console.log(this.server.to(String(room.user1_id)).emit(`render-gameroom`, {status: 'gameroom', room: room}));
        if(user2 !== null)
            console.log(this.server.to(String(user2)).emit(`render-gameroom`, {status: 'home', room: room}));
        return {status: true, message: "게임방 나가기 성공"};
    }

    async InviteGameRoom(user_id: number, target_id: number, user_nicknmae: string)
    {
        if (this.gameRoomMap.get(user_id) === undefined)
            return {status: false, message: "게임방이 존재하지 않습니다."};
        const room = this.gameRoomMap.get(user_id);
        if (room.user2_id !== null)
            return {status: false, message: "이미 상대가 있습니다."};
        this.eventService.SendEvent({to: target_id, type: `game`, from: user_nicknmae, chatroom_id: user_id});
        return {status: true, message: "게임 초대 보내기 성공"};
    }

    GetRoomInfo(user_id: number)
    {
        return this.gameRoomMap.get(user_id);
    }

    Ready(user_id: number, ready: boolean)
    {
        const room = this.gameRoomMap.get(user_id);
        if (room === undefined)
            return {status: false, message: "게임이 존재하지 않습니다."};
        if (room.user1_id === user_id)
            room.user1_ready = ready;
        else
            room.user2_ready = ready;
        console.log(this.gameRoomMap);
        console.log(this.server.to(String(room.user1_id)).emit(`render-gameroom`, {status: 'gameroom', room: room}));
        if (room.user2_id !== null)
            console.log(this.server.to(String(room.user2_id)).emit(`render-gameroom`, {status: 'gameroom', room: room}));
        return {status: true, message: "게임 준비 성공"};
    }

    Start(user_id: number)
    {
        const room = this.gameRoomMap.get(user_id);
        if (room === undefined || room.user1_id !== user_id || room.user2_id === null)
            return {status: false, message: "정상적인 방이 아닙니다."};
        if (!room.user1_ready || !room.user2_ready)
            return {status: false, message: "준비가 되지 않았습니다."};
        this.gameRoomMap.delete(room.user1_id);
        this.gameRoomMap.delete(room.user2_id);
        this.server.to(`${room.user1_id}`).emit(`render-gameroom`, {status:'ingame', room: room});
        this.server.to(`${room.user2_id}`).emit(`render-gameroom`, {status:'ingame', room: room});
        this.SocketService.JoinRoom(room.user1_id, `game-${room.user1_id}`, this.server);
        this.SocketService.JoinRoom(room.user2_id, `game-${room.user1_id}`, this.server);
        return {status: true, message: "게임 시작 성공"};
    }

    MatchGame(user_id: number)
    {
        if (this.gameMatchQue.includes(user_id)) {
            return {status: false, message: "매칭 대기 중"};
        }
        if (this.gameMatchQue.length === 0)
        {
            this.gameMatchQue.push(user_id);
            this.server.to(String(user_id)).emit(`render-gameroom`, {status: 'matching', room: user_id});
            return {status: false, message: "매칭 대기 중"};
        }
        const enemy_id = this.gameMatchQue.pop();
        this.InGame.set(enemy_id, new InGameRoom(enemy_id));
        this.InGame.get(enemy_id).user2_id = user_id;
        this.InGame.set(user_id, this.InGame.get(enemy_id));
        this.SocketService.JoinRoom(enemy_id, `game-${enemy_id}`, this.server);
        this.SocketService.JoinRoom(user_id, `game-${enemy_id}`, this.server);
        this.server.to(`game-${enemy_id}`).emit(`render-gameroom`, {status: 'ingame', room: this.InGame.get(enemy_id)});
        return {status: true, message: "매칭 성공", data: this.InGame.get(user_id)};
    }

    CancelMatch()
    {
        const user_id = this.gameMatchQue.pop();
        this.server.to(String(user_id)).emit(`render-gameroom`, {status: 'home', room: user_id});
        return {status: true, message: "매칭 취소 완료", data: user_id}
    }


    async ExitGame(user_id: number)
    {
        if (this.InGame.get(user_id) === undefined)
            return {status: false, message: "게임이 존재하지 않습니다."};
        const user1_id = this.InGame.get(user_id).user1_id;
        const user2_id = this.InGame.get(user_id).user2_id;
        this.server.to(`game-${user1_id}`).emit(`game-end`, {gameData: this.InGame.get(user_id)});
        this.InGame.delete(user1_id);
        this.InGame.delete(user2_id);
        this.SocketService.LeaveRoom(String(user1_id), `game-${user1_id}`, this.server);
        this.SocketService.LeaveRoom(String(user2_id), `game-${user1_id}`, this.server);
        const user1 =   await this.prismaservice.user.findUnique({
            where: {
                user_id: user1_id,
            },
        });
        const user2 =   await this.prismaservice.user.findUnique({
            where: {
                user_id: user2_id,
            },
        });
        //Elo 계산
        const user2_we = 1 / ((10 ** ((user1.ladder - user2.ladder) / 400)) + 1);
        const user1_we = 1 - user2_we;
        const k = 20;
        const user2_winLose = user_id === user2.user_id ? 0 : 1;
        const user1_winLose = user_id === user1.user_id ? 0 : 1;
        const user2_pb = user2.ladder + k * (user2_winLose - user2_we);
        const user1_pb = user1.ladder + k * (user1_winLose - user1_we);
        if (user1_winLose)
        {
            user1.win++;
            user2.lose++;
        }
        else
        {
            user1.lose++;
            user2.win++;
        }
        console.log("user2_pb : ", Math.round(user2_pb), "user1_pb : ", Math.round(user1_pb));
        //prisma data에 넣기
        await this.prismaservice.user.update({
            where: {
                user_id: user1_id,
            },
            data: {
                win : user1.win,
                lose : user1.lose,
                ladder: Math.round(user1_pb),
            },
        });
        await this.prismaservice.user.update({
            where: {
                user_id: user2_id,
            },
            data: {
                win : user2.win,
                lose : user2.lose,
                ladder: Math.round(user2_pb),
            },
        });
        return {status: true, message: "게임 종료"};
    }

    async ForceGameEnd(user_id: number)
    {
        if (this.InGame.get(user_id) === undefined)
            return {status: false, message: "게임이 존재하지 않습니다."};
        const inGame = this.InGame.get(user_id);
        if (inGame.user1_id === user_id)
        {
            inGame.score2 = 11;
            inGame.score1 = 0;
        }
        else
        {
            inGame.score2 = 0;
            inGame.score1 = 11;
        }
        this.ExitGame(user_id);
    }

    async GameStart(payload: any)
    {
        if (!this.InGame.get(Number(payload.user_id)))
            return ;
        if (this.InGame.get(Number(payload.user_id)).user1_id === Number(payload.user_id))
        {
            this.InGame.get(Number(payload.user_id)).user1_ready = true;
            this.InGame.get(Number(payload.user_id)).user1_nickname = payload.user_nickname;
        }
        else
        {
            this.InGame.get(Number(payload.user_id)).user2_ready = true;
            this.InGame.get(Number(payload.user_id)).user2_nickname = payload.user_nickname;
        }
        if (this.InGame.get(Number(payload.user_id)).user1_ready && this.InGame.get(Number(payload.user_id)).user2_ready)
        {
            console.log("game start send", this.InGame.get(Number(payload.user_id)));
            const room = this.InGame.get(Number(payload.user_id));
            setTimeout(() => {
                console.log(`after time out`,room);
                this.server.to(`game-${room.user1_id}`).emit(`game-init`, {room: room});
            }, 1000);
        }
    }

    async GameUserPosition(payload: any, user_id: number)
    {
        console.log("game: ", payload, user_id, this.InGame.get(user_id));
        if (this.InGame.get(user_id) === undefined)
            return ;
        if (this.InGame.get(user_id).user1_id === user_id) {
            console.log(`game-${this.InGame.get(user_id).user2_id}`);
            this.server.to(`${this.InGame.get(user_id).user2_id}`).emit(`game-user-position`, payload);
        }
        else {
            console.log(`game-${this.InGame.get(user_id).user1_id}`);
            this.server.to(`${this.InGame.get(user_id).user1_id}`).emit(`game-user-position`, payload);
        }
    }

    async GameBallHit(payload: any, user_id: number)
    {
        if (this.InGame.get(user_id) === undefined)
            return ;
        this.InGame.get(user_id).score1 = payload.score.player1;
        this.InGame.get(user_id).score2 = payload.score.player2;
        if (this.InGame.get(user_id).score1 >= 11 || this.InGame.get(user_id).score2 >= 11)
            return this.ExitGame(user_id);
        if (this.InGame.get(user_id).user1_id === user_id) {
            console.log(`game-${this.InGame.get(user_id).user2_id}`);
            this.server.to(`${this.InGame.get(user_id).user2_id}`).emit(`game-ball-fix`, payload);
        }
        else {
            console.log(`game-${this.InGame.get(user_id).user1_id}`);
            this.server.to(`${this.InGame.get(user_id).user1_id}`).emit(`game-ball-fix`, payload);
        }
    }
}