import { Body, Controller, Param, ParseIntPipe, Post, Query, Req, Sse } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Subject } from 'rxjs';
import { EventService } from './event.service'

@ApiTags('Event API')
@Controller('event')
export class EventController {
    constructor(
        private readonly EventService: EventService,
    ) {}

    @ApiOperation({summary: `SSE API`, description: `SSE 테스트를 위한 API`})
    @Sse('sse')
    sse(@Req() req, @Query('id', ParseIntPipe) id : number) {
        return this.EventService.sse(req, id);
    }

    @Post('test')
    test(@Body() data) {
        this.EventService.sendEventToAllClients(data.id);
    }
}
