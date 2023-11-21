import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, Sse } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Subject } from 'rxjs';
import { EventService } from './event.service'
import { eventDto } from './dto/event.dto';

@ApiTags('Event API')
@Controller('event')
export class EventController {
    constructor(
        private readonly EventService: EventService,
    ) {}

    @ApiOperation({summary: `SSE API`, description: `SSE 테스트를 위한 API`})
    @Sse('alarmsse/:id')
    async AlarmSse(@Req() req, @Param('id', ParseIntPipe) id : number) {
        return await this.EventService.AlarmSse(req, id);
    }

    @ApiOperation({summary: `친구목록 랜더링 API`, description: `친구목록 랜더링 API`})
    @Sse('friendlist/:id')
    async FriendListSse(@Req() req, @Param('id', ParseIntPipe) id : number) {
        return await this.EventService.FriendListSse(req, id);
    }

    @ApiOperation({summary: `GETAlarms API`, description: `최초 접속 시 쌓여있던 받기 위한 API`})
    @Get('getalarms/:id')
    async GetAlarms(@Param('id', ParseIntPipe) id : number) {
        return await this.EventService.GetAlarms(id);
    }

    @ApiOperation({summary: `DeleteAlarms API`, description: `특정 ID 알람 삭제 API`})
    @Delete('deletealarms/:id')
    async DeleteAlarms(@Param('id', ParseIntPipe) id : number) {
        return await this.EventService.DeleteAlarms(id);
    }

    @ApiOperation({summary: `알람 전체삭제 API`, description: `닉네임으로 모든 알람을 삭제한다 API`})
    @Delete('deleteallalarms/:nick_name')
    async DeletAllAlarmsByNick(@Param('nick_name') nick_name : string) {
        return await this.EventService.DeletAllAlarmsByNick(nick_name);
    }

    @ApiOperation({summary: `test용 이벤트 발생 `})
    @Post('test')
    async test(@Body() event: eventDto) {
        return await this.EventService.SendEvent(event);
    }
}
 