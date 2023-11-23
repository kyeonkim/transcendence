import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { SocketService } from "./socket.service";

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
export class SocketGameService {
    // private server: Server;
    // constructor(
    //     private readonly SocketService: SocketService
    // ){}
    // private gameRoomMap = new Map<number, GameRoom>();
    // private gameMatchQue = new Array<number>();
    // private InGame = new Map<number, InGameRoom>();

    // setServer(server: Server) {
    //   this.server = server;
    // }

    // async CreateGameRoom(user_id: number)
    // {
    //     if (this.gameRoomMap.get(user_id) !== undefined)
    //         return {status: false, message: "이미 게임방이 존재합니다."};
    //     this.gameRoomMap.set(user_id, new GameRoom(user_id));
    //     this.SocketGateway.SendReRenderGameRoom(this.gameRoomMap.get(user_id), user_id);
    //     return {status: true, message: "게임방 생성 성공"};
    // }

    // async JoinGameRoom(user1_id: number, user2_id: number, event_id: number)
    // {
    //     if (this.gameRoomMap.get(user1_id) === undefined)
    //         return {status: false, message: "게임방이 존재하지 않습니다."};
    //     const room = this.gameRoomMap.get(user1_id);
    //     if(!room || room.user2_id)
    //         return {status: false, message: "초대가 만료되었습니다."};
    //     room.user2_id = user2_id;
    //     this.gameRoomMap.set(user2_id, room);
    //     this.SocketGateway.SendReRenderGameRoom(room, user1_id, user2_id);
    //     this.eventService.DeleteAlarms(event_id);
    //     return {status: true, message: "게임방 참가 성공"};
    // }

    // async LeaveGameRoom(user_id: number)
    // {
    //     if (this.gameRoomMap.get(user_id) === undefined)
    //         return {status: false, message: "게임방이 존재하지 않습니다."};
    //     const room = this.gameRoomMap.get(user_id);
    //     if (room.user1_id === user_id)
    //         this.gameRoomMap.delete(room.user1_id);
    //     this.gameRoomMap.delete(room.user2_id);
    //     room.user2_id = null;
    //     this.SocketGateway.SendReRenderGameRoom(room, user_id);
    //     return {status: true, message: "게임방 나가기 성공"};
    // }

    // async InviteGameRoom(user_id: number, target_id: number, user_nicknmae: string)
    // {
    //     if (this.gameRoomMap.get(user_id) === undefined)
    //         return {status: false, message: "게임방이 존재하지 않습니다."};
    //     const room = this.gameRoomMap.get(user_id);
    //     if (room.user2_id !== null)
    //         return {status: false, message: "이미 상대가 있습니다."};
    //     room.user2_id = target_id;
    //     this.gameRoomMap.set(target_id, room);
    //     this.eventService.SendEvent({to: target_id, type: `game`, from: user_nicknmae});
    //     return {status: true, message: "게임 초대 보내기 성공"};
    // }

    // GetRoomInfo(user_id: number)
    // {
    //     return this.gameRoomMap.get(user_id);
    // }

    // MatchGame(user_id: number)
    // {
    //     if (this.gameMatchQue.length === 0)
    //     {
    //         this.gameMatchQue.push(user_id);
    //         return {status: true, message: "매칭 대기 중"};
    //     }
    //     const enemy_id = this.gameMatchQue.pop();
    //     this.InGame.set(user_id, new InGameRoom(user_id));
    //     this.InGame.get(user_id).user2_id = enemy_id;
    //     this.InGame.set(enemy_id, this.InGame.get(user_id));
    //     this.SocketGateway.JoinRoom(user_id, `game-${user_id}`);
    //     return {status: true, message: "매칭 성공", data: this.InGame.get(user_id)};
    // }
}