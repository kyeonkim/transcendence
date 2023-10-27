import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { gameDataDto } from './dto/game.dto';
import { GameService } from './game.service';

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
    @Get("data")
    async GetGameDataById(@Query('id', ParseIntPipe) id: number, @Query('index', ParseIntPipe) index: number)
    {
        const gameData = await this.GameService.GetGameDataById(id, index);
        return gameData;
    }
}
