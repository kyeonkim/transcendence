import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    async CreateRoom(data: CreateRoomDto)
    {
        // const room = await this.prismaService.chatroom.create({
        //     data: {
        //         owner_id: data.user_id,
        //         name: data.chatroom_name,
        //         password: data.password ? data.password : null,
        //         private: data.private,
        //     },
        // });
        // if (room === undefined)
        //     return {status: false, message: 'fail to create room'};
        // await this.prismaService.user.update({
        //     where: {
        //         user_id: data.user_id,
        //     },
        //     data: {
        //         chatroom_id: room.idx,
        //     },
        // });
        console.log(data.socket);
        // return {status: true, message: 'success', room: room};
    }
}
