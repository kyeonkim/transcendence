import { Headers, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatRoomDto, InviteChatDto, JoinRoomDto, SetChatUserDto } from './dto/chat.dto';
import { SocketGateway } from 'src/socket/socket.gateway';
import { JwtService } from '@nestjs/jwt';
import { eventDto } from 'src/event/dto/event.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Chat API')
@Controller('chat')
export class ChatController {
    constructor(
        private readonly ChatService: ChatService,
        private readonly socketService: SocketGateway,
    ) {}

    @ApiOperation({summary: `채팅방 목록 API`, description: `채팅방 목록을 가져온다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Get("roomlist/:id")
    async RoomList(@Param('id', ParseIntPipe) id: number)
    {
        return await this.ChatService.GetRoomList(id);
    }

    @ApiOperation({summary: `채팅방 정보 API`, description: `채팅방 정보를 가져온다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Get("roominfo/:room_idx")
    async RoomInfo(@Param('room_idx', ParseIntPipe) room_idx: number)
    {
        return await this.ChatService.RoomInfo(room_idx);
    }

    @ApiOperation({summary: `채팅 방 생성 API`, description: `채팅방을 만든다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Post("createroom")
    async CreateRoom(@Body() room: ChatRoomDto)
    {
        return await this.ChatService.CreateRoom(room);
    }

    @ApiOperation({summary: `채팅 방 수정 API`, description: `채팅방을 수정한다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Patch("changeroom")
    async ChangeRoom(@Body() room: ChatRoomDto)
    {
        //권환 확인 필요
        return await this.ChatService.ChangeRoom(room);
    }

    @ApiOperation({summary: `채팅 방 입장 API`, description: `채팅방에 입장한다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Patch("joinroom")
    async JoinRoom(@Body() data : JoinRoomDto)
    {
        const rtn =  await this.ChatService.JoinRoom(data);
        if (rtn.status === true)
            await this.socketService.HandleNotice(data.room_id, `${data.user_nickname}님이 입장하셨습니다.`);
        console.log("JoinRoom: ", data, rtn);
        return rtn;
    }

    @ApiOperation({summary: `채팅 방 퇴장 API`, description: `채팅방에서 퇴장한다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Patch("leaveroom")
    async LeaveRoom(@Body() room : JoinRoomDto)
    {
        const rtn = await this.ChatService.LeaveRoom(room);
        console.log(rtn);
        if (rtn.status === true)
            this.socketService.HandleNotice(room.room_id, `유저 ${room.user_nickname}님이 퇴장하였습니다.`);
        return rtn;
    }

    //내가 방장인지 확인하는 방법이 있어야하지 않을까?
    @ApiOperation({summary: `관리자 임명 API`, description: `관리자를 임명한다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Patch("setmanager")
    async SetManager(@Body() data : SetChatUserDto)
    {
        //토큰을 가져와서 유저아이디와 room_idx의 방장인지 확인해야할듯
        return await this.ChatService.SetManager(data);
    }

    @ApiOperation({summary: `관리자 해제 API`, description: `관리자를 해제한다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Patch("unsetmanager")
    async UnsetManager(@Headers() headers, @Body() data : SetChatUserDto)
    {
        //토큰을 가져와서 유저아이디와 room_idx의 방장인지 확인해야할듯
        const room =  await this.ChatService.GetMyRoomByHeader(headers);
        if (room === null || room.chatroom_id !== data.room_id || room.is_manager !== true)
            return {status: false, message: 'not manager'};
        return await this.ChatService.UnsetManager(data);
    }

    @ApiOperation({summary: `유저 mute API`, description: `유저를 mute한다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Patch("muteuser")
    async MuteUser(@Headers() headers, @Body() data : SetChatUserDto)
    {
        //토큰을 가져와서 유저아이디와 room_idx의 매니저인지 확인해야할듯
        const room =  await this.ChatService.GetMyRoomByHeader(headers);
        // console.log(room);
        if (room === null || room.chatroom_id !== data.room_id || room.is_manager !== true)
            return {status: false, message: 'not manager'};
        else
            return await this.ChatService.MuteUser(data);
    }

    @ApiOperation({summary: `유저 unmute API`, description: `유저를 unmute한다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Patch("unmuteuser")
    async UnmuteUser(@Body() data : SetChatUserDto)
    {
        //토큰을 가져와서 유저아이디와 room_idx의 매니저인지 확인해야할듯
        return await this.ChatService.UnmuteUser(data);
    }

    @ApiOperation({summary: `유저 ban API`, description: `유저를 ban한다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Patch("banuser")
    async BanUser(@Body() data : SetChatUserDto)
    {
        //권한 확인 필요
        return await this.ChatService.BanUser(data);
    }

    @ApiOperation({summary: `유저 unban API`, description: `유저를 unban한다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Patch("unbanuser")
    async UnbanUser(@Body() data : SetChatUserDto)
    {
        //권한 확인 필요
        return await this.ChatService.UnbanUser(data);
    }

    @ApiOperation({summary: `강제퇴장 API`, description: `유저를 강제퇴장시킨다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Patch("kickuser")
    async KickUser(@Body() data : SetChatUserDto)
    {
        //권한 확인 필요
        return await this.ChatService.KickUser(data);
    }

    @ApiOperation({summary: `채팅방 초대 API`, description: `채팅방에 유저를 초대한다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Post("inviteuser")
    async InviteUser(@Body() data : InviteChatDto)
    {
        return await this.ChatService.InviteUser(data);
    }

    @ApiOperation({summary: `채팅방 초대 수락 API`, description: `채팅방 초대를 수락한다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Post("acceptinvite")
    async AcceptInvite(@Body() data : JoinRoomDto)
    {
        return await this.ChatService.AcceptInvite(data);
    }

    @ApiOperation({summary: `dm 가져오기 API`, description: `dm 을 가져온다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Get("dm")
    async GetDm(@Query('id', ParseIntPipe) id: number, @Query('from_id', ParseIntPipe) from_id: number, @Query(`idx`, ParseIntPipe) idx: number)
    {
        return await this.ChatService.GetDm(idx, id, from_id);
    }

    @ApiOperation({summary: `안읽은 dm 가져오기 API`, description: `안읽은 dm 을 가져온다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Get("unreaddm")
    async GetUnreadDm(@Query('user_id', ParseIntPipe) user_id: number, @Query('from_id', ParseIntPipe) from_id: number)
    {
        return await this.ChatService.GetUnreadDm(user_id, from_id);
    }
}
