import { Body, Controller, Get, UseGuards, ParseIntPipe, Post, Query, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { gameDataDto, gameRoomDto, leaveGameRoomDto } from './dto/game.dto';
import { GameService } from './game.service';
import { AuthGuard } from '@nestjs/passport';
import { eventDto } from 'src/event/dto/event.dto';

@ApiTags('Game API')
@Controller('game')
export class GameController {
    constructor(
        private readonly GameService: GameService,
    ) {}

    @ApiOperation({summary: `전적 추가 API`, description: `전적을 추가한다.`})
    @Post("adddata")
    AddGameData(@Body() gameData: gameDataDto)
    {
        return this.GameService.AddGameData(gameData);
    }

    @ApiOperation({summary: `전적 데이터 API`, description: `전적 db를 가져온다`})
	@UseGuards(AuthGuard('jwt-access'))
	@ApiBearerAuth('JWT-acces')
    @Get("data")
    async GetGameDataById(@Query('id', ParseIntPipe) id: number, @Query('index', ParseIntPipe) index: number)
    {
        const gameData = await this.GameService.GetGameDataById(id, index);
        return gameData;
    }

    @ApiOperation({summary: `게임방 만들기 API`, description: `게임방을 만든다.`})
	// @UseGuards(AuthGuard('jwt-access'))
	// @ApiBearerAuth('JWT-acces')
    @Post("createroom")
    async CreateRoom(@Body() data: gameRoomDto)
    {
        const room = await this.GameService.CreateGameRoom(data.user1_id);
        return room;
    }

    @ApiOperation({summary: `게임방 나가기 API`, description: `게임방을 나간다.`})
    // @UseGuards(AuthGuard('jwt-access'))
    // @ApiBearerAuth('JWT-acces')
    @Patch("leaveroom")
    async LeaveRoom(@Body() data: leaveGameRoomDto)
    {
        const room = await this.GameService.LeaveGameRoom(data.user_id);
        return room;
    }

    @ApiOperation({summary: `게임방 초대 API`, description: `게임방에 초대한다.`})
	// @UseGuards(AuthGuard('jwt-access'))
	// @ApiBearerAuth('JWT-acces')
    @Post("inviteroom")
    async InviteRoom(@Body() data: gameRoomDto)
    {
        const room = await this.GameService.InviteGameRoom(data.user1_id, data.user2_id, data.user1_nickname);
        return room;
    }

    @ApiOperation({summary: `게임방 참여 API`, description: `게임방에 참여한다.`})
	// @UseGuards(AuthGuard('jwt-access'))
	// @ApiBearerAuth('JWT-acces')
    @Patch ("joinroom")
    async JoinRoom(@Body() data: gameRoomDto)
    {
        const room = await this.GameService.JoinGameRoom(data.user1_id, data.user2_id, data.event_id);
        console.log(room);
        return room;
    }
}
