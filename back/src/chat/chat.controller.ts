import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { async } from 'rxjs';
import { CreateRoomDto, JoinRoomDto } from './dto/chat.dto';

@ApiTags('Chat API')
@Controller('chat')
export class ChatController {
    constructor(
        private readonly ChatService: ChatService,
    ) {}

    @ApiOperation({summary: `채팅방 목록 API`, description: `채팅방 목록을 가져온다.`})
    @Get("roomlist/:id")
    async RoomList(@Param('id') id: number)
    {
        return await this.ChatService.GetRoomList(id);
    }

    @ApiOperation({summary: `채팅방 정보 API`, description: `채팅방 정보를 가져온다.`})
    @Get("roominfo/:room_idx")
    async RoomInfo(@Param('room_idx') room_idx: number)
    {
        return await this.ChatService.RoomInfo(room_idx);
    }

    @ApiOperation({summary: `채팅 방 생성 API`, description: `채팅방을 만든다.`})
    @Post("createroom")
    async CreateRoom(@Body() room: CreateRoomDto)
    {
        return await this.ChatService.CreateRoom(room);
    }

    @ApiOperation({summary: `채팅 방 입장 API`, description: `채팅방에 입장한다.`})
    @Patch("joinroom")
    async JoinRoom(@Body() data : JoinRoomDto)
    {
        this.ChatService.JoinRoom(data);
    }

    @ApiOperation({summary: `채팅 방 퇴장 API`, description: `채팅방에서 퇴장한다.`})
    @Patch("leaveroom")
    async LeaveRoom(@Body() room : JoinRoomDto)
    {
        this.ChatService.LeaveRoom(room.user_id, room.room_id);
    }
}
