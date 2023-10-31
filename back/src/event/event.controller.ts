import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, Sse } from '@nestjs/common';
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
    AlarmSse(@Req() req, @Param('id', ParseIntPipe) id : number) {
        return this.EventService.AlarmSse(req, id);
    }

    @ApiOperation({summary: `친구목록 랜더링 API`, description: `친구목록 랜더링 API`})
    @Sse('friendlist/:id')
    FriendListSse(@Req() req, @Param('id', ParseIntPipe) id : number) {
        return this.EventService.FriendListSse(req, id);
    }

    @ApiOperation({summary: `GETEvent API`, description: `최초 접속 시 이벤트를 받기 위한 API`})
    @Get('getevents/:id')
    getEvents(@Param('id', ParseIntPipe) id : number) {
        return this.EventService.GetEvents(id);
    }

    @Post('test')
    test(@Body() event: eventDto) {
        return this.EventService.SendEvent(event);
    }
}
 