import { Body, Controller, Get, UseGuards, ParseIntPipe, Post, Query, Patch, Req, Headers } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { gameDataDto, gameRoomDto, leaveGameRoomDto, readyGameDto, startGameDto } from './dto/game.dto';
import { GameService } from './game.service';
import { AuthGuard } from '@nestjs/passport';
import { eventDto } from 'src/event/dto/event.dto';

@ApiTags('Game API')
@Controller('game')
export class GameController {
    constructor(
        private readonly GameService: GameService,
    ) {}

    @ApiOperation({summary: `전적 데이터 API`, description: `전적 db를 가져온다`})
	@UseGuards(AuthGuard('jwt-access'))
	@ApiBearerAuth('JWT-acces')
    @Get("data")
    async GetGameDataById(@Query('id', ParseIntPipe) id: number, @Query('index', ParseIntPipe) index: number)
    {
        const gameData = await this.GameService.GetGameDataById(id, index);
        return gameData;
    }

    @ApiOperation({summary: `게임방 체크 API`, description: `게임방에 있는지 체크한다.`})
	@UseGuards(AuthGuard('jwt-access'))
	@ApiBearerAuth('JWT-acces')
    @Post("checkroom")
    async CheckRoom(@Req() req, @Body() data: gameRoomDto)
    {
		data.user1_id = req.tokenuserdata.user_id;
		data.user1_nickname = req.tokenuserdata.nick_name;
        return await this.GameService.CheckGameRoom(data.user1_id);
    }

    @ApiOperation({summary: `게임방 만들기 API`, description: `게임방을 만든다.`})
	@UseGuards(AuthGuard('jwt-access'))
	@ApiBearerAuth('JWT-acces')
    @Post("createroom")
    async CreateRoom(@Req() req, @Body() data: gameRoomDto)
    {
        data.user1_id = req.tokenuserdata.user_id;
		data.user1_nickname = req.tokenuserdata.nick_name;
        return await this.GameService.CreateGameRoom(data.user1_id);
    }

    @ApiOperation({summary: `게임방 나가기 API`, description: `게임방을 나간다.`})
    @UseGuards(AuthGuard('jwt-access'))
    @ApiBearerAuth('JWT-acces')
    @Patch("leaveroom")
    async LeaveRoom(@Req() req, @Body() data: leaveGameRoomDto)
    {
        data.user_id = req.tokenuserdata.user_id;
        // console.log(`leave room called ${req.tokenuserdata.user_id}`)
        const room = await this.GameService.LeaveGameRoom(data.user_id);
        return room;
    }

    @ApiOperation({summary: `게임방 초대 API`, description: `게임방에 초대한다.`})
	@UseGuards(AuthGuard('jwt-access'))
	@ApiBearerAuth('JWT-acces')
    @Post("inviteroom")
    async InviteRoom(@Req() req, @Body() data: gameRoomDto)
    {
        data.user1_id = req.tokenuserdata.user_id;
		data.user1_nickname = req.tokenuserdata.nick_name;
        return await this.GameService.InviteGameRoom(data.user1_id, data.user2_id, data.user1_nickname);
    }

    @ApiOperation({summary: `게임방 참여 API`, description: `게임방에 참여한다.`})
	@UseGuards(AuthGuard('jwt-access'))
	@ApiBearerAuth('JWT-acces')
    @Patch ("joinroom")
    async JoinRoom(@Req() req, @Body() data: gameRoomDto)
    {
        data.user2_id = req.tokenuserdata.user_id;
		data.user2_nickname = req.tokenuserdata.nick_name;
        return await this.GameService.JoinGameRoom(data.user1_id, data.user2_id, data.event_id);
    }

    @ApiOperation({summary: `게임 준비 API`, description: `게임을 준비한다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Patch("ready")
    async Ready(@Req() req, @Body() data: readyGameDto)
    {
        data.user_id = req.tokenuserdata.user_id;
        return await this.GameService.Ready(data.game_mode, data.user_id, data.ready);
    }

    @ApiOperation({summary: `게임 시작 API`, description: `게임을 시작한다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Post("start")
    async Start(@Req() req, @Body() data: startGameDto)
    {
        data.user_id = req.tokenuserdata.user_id;
        return await this.GameService.Start(data.user_id);
    }

    @ApiOperation({summary: `게임 매칭 API`, description: `게임을 매칭한다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Post("match")
    async MatchGame(@Req() req, @Body() data: startGameDto)
    {
        data.user_id = req.tokenuserdata.user_id;
        return await this.GameService.MatchGame(data.user_id);
    }

    // @ApiOperation({summary: `게임 매칭 취소 API`, description: `게임을 매칭을 취소한다.`})
	// @UseGuards(AuthGuard('jwt-access'))
    // @Patch("cancelmatch")
    // async CancelMatch()
    // {
    //     return await this.GameService.CancleMatch();
    // }

    @ApiOperation({summary: `게임 종료 API`, description: `게임을 종료한다.`})
	@UseGuards(AuthGuard('jwt-access'))
    @Patch("exitgame")
    async ExitGame(@Req() req, @Body() data: startGameDto) {
        data.user_id = req.tokenuserdata.user_id;
        return await this.GameService.ExitGame(data.user_id);
    }
}
