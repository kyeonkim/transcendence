import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Chat API')
@Controller('chat')
export class ChatController {

    @ApiOperation({summary: `채팅 방 생성 API`, description: `채팅방을 만든다.`})
    @Post("createroom")
    async CreateRoom()
    {
        return `okay`;
    }
}
