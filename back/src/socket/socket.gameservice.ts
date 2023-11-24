import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { SocketService } from "./socket.service";
import { EventService } from "src/event/event.service";

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
    score1: number;
    score2: number;
}

@Injectable()
export class SocketGameService {
    private server: Server;
    constructor(
        private readonly SocketService: SocketService,
        private readonly eventService: EventService,
    ){}
    private gameRoomMap = new Map<number, GameRoom>();
    private gameMatchQue = new Array<number>();
    private InGame = new Map<number, InGameRoom>();

    setServer(server: Server) {
      this.server = server;
    }

    async CreateGameRoom(user_id: number)
    {
        if (this.gameRoomMap.get(user_id) !== undefined)
        {
            this.server.to(String(user_id)).emit(`render-gameroom`, {room: this.gameRoomMap.get(user_id)});
            return {status: false, message: "이미 게임방이 존재합니다."};
        }
        this.gameRoomMap.set(user_id, new GameRoom(user_id));
        console.log(this.server.to(String(user_id)).emit(`render-gameroom`, {room: this.gameRoomMap.get(user_id)}));
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
        console.log(this.server.to(String(user1_id)).emit(`render-gameroom`, {room: room}));
        console.log(this.server.to(String(user2_id)).emit(`render-gameroom`, {room: room}));
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
        console.log(this.server.to(String(room.user1_id)).emit(`render-gameroom`, {room: room}));
        if(user2 !== null)
            console.log(this.server.to(String(user2)).emit(`render-gameroom`, {room: room}));
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
        console.log(this.server.to(String(room.user1_id)).emit(`render-gameroom`, {room: room}));
        if (room.user2_id !== null)
            console.log(this.server.to(String(room.user2_id)).emit(`render-gameroom`, {room: room}));
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
        this.server.to(`${room.user1_id}`).emit(`start-game`, {room: room});
        this.server.to(`${room.user1_id}`).emit(`start-game`, {room: room});
        this.SocketService.JoinRoom(room.user1_id, `game-${room.user1_id}`, this.server);
        this.SocketService.JoinRoom(room.user2_id, `game-${room.user1_id}`, this.server);
        return {status: true, message: "게임 시작 성공"};
    }

    MatchGame(user_id: number)
    {
        if (this.gameMatchQue.length === 0)
        {
            this.gameMatchQue.push(user_id);
            return {status: true, message: "매칭 대기 중"};
        }
        const enemy_id = this.gameMatchQue.pop();
        this.InGame.set(enemy_id, new InGameRoom(user_id));
        this.InGame.get(enemy_id).user2_id = user_id;
        this.InGame.set(user_id, this.InGame.get(user_id));
        this.SocketService.JoinRoom(enemy_id, `game-${enemy_id}`, this.server);
        this.SocketService.JoinRoom(user_id, `game-${enemy_id}`, this.server);
        return {status: true, message: "매칭 성공", data: this.InGame.get(user_id)};
    }
}