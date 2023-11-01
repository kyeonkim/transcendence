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
    AlarmSse(@Req() req, @Param('id', ParseIntPipe) id : number) {
        return this.EventService.AlarmSse(req, id);
    }

    @ApiOperation({summary: `친구목록 랜더링 API`, description: `친구목록 랜더링 API`})
    @Sse('friendlist/:id')
    FriendListSse(@Req() req, @Param('id', ParseIntPipe) id : number) {
        return this.EventService.FriendListSse(req, id);
    }

    @ApiOperation({summary: `GETAlarms API`, description: `최초 접속 시 쌓여있던 받기 위한 API`})
    @Get('getalarms/:id')
    GetAlarms(@Param('id', ParseIntPipe) id : number) {
        return this.EventService.GetAlarms(id);
    }

    @ApiOperation({summary: `DeleteAlarms API`, description: `특정 ID 알람 삭제 API`})
    @Delete('deletealarms/:id')
    DeleteAlarms(@Param('id', ParseIntPipe) id : number) {
        return this.EventService.DeleteAlarms(id);
    }

    @Post('test')
    test(@Body() event: eventDto) {
        return this.EventService.SendEvent(event);
    }
}
 