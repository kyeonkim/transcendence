import { Injectable } from '@nestjs/common';
import { Subject, map } from 'rxjs';
import { eventDto } from './dto/event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventService {
    private AlarmSseMap = new Map<number, Subject<any>>();
    private FriendListSseMap = new Map<number, Subject<any>>();

    constructor(
        private readonly pismaService: PrismaService,
    ) {}

    async AlarmSse(req, id: number) {
        if (this.AlarmSseMap.get(id) !== undefined)
            return this.AlarmSseMap.get(id);
        const newEvent = new Subject<any>();
        this.AlarmSseMap.set(id, newEvent);
        req.on('close', (_) => {
            this.AlarmSseMap.delete(id);
        });
        return this.AlarmSseMap.get(id);
    }

    async SendFriendEvent(id: number)
    {
        if (this.FriendListSseMap.get(id) === undefined)
            return {status: false, message: 'no client'};
        this.FriendListSseMap.get(id).next({data: 'friend event'});
        return {status:true, message: 'success'};
    }

    async GetAlarms(id: number) {
        if(this.AlarmSseMap.get(id) === undefined)
            return {status: false, message: 'no client'}
        const events = await this.pismaService.event.findMany({
            where: {
                to_id: id,
            },
        });
        for(let i = 0; i < events.length; i++)
        {
            if(this.AlarmSseMap.get(id) !== undefined)
                this.AlarmSseMap.get(id).next({data: events[i]});
        }
    }

    async DeleteAlarms(event_id: number) {
        try {
            const rtn = await this.pismaService.event.delete({
                where: {
                    idx: event_id,
                },
            });
            return rtn;
        } catch (error) {
            return {status: false, message: 'DeleteAlarms failed'};
        }
    }

    // async DeletAllAlarmsByNick(nick_name: string) {
    //     const user = await this.pismaService.user.findUnique({
    //         where: {
    //             nick_name: nick_name,
    //         },
    //     });
    //     if (user === null)
    //         return {status: false, message: 'no user'};
    //     await this.pismaService.event.deleteMany({
    //         where: {
    //             to_id: user.user_id,
    //         },
    //     });
    //     return {status: true, message: 'success'};
    // }

    async SendEvent(event: eventDto) {
        const fromuser = await this.pismaService.user.findUnique({ where: {nick_name: event.from} });
        if (fromuser === null || fromuser.user_id === event.to)
            return {status: false, message: 'invalid user'};
        const ban = await this.pismaService.block.findFirst({
            where: { 
                user_id: fromuser.user_id,
                blocked_user_id: event.to,
            }, 
        });
        if (ban !== null)
            return {status: false, message: 'ban user'};
        const before_event = await this.pismaService.event.findFirst({
            where: {
                to_id: event.to,
                event_type: event.type,
                from_nickname: event.from,
                chatroom_id: event.chatroom_id,
                chatroom_name: event.chatroom_name,
            },
        });
        if (before_event !== null)
            return {status: false, message: 'already send'}
        const alarm = await this.pismaService.event.create({
            data: {
                to_id: event.to,
                event_type: event.type,
                from_nickname: event.from,
                chatroom_id: event.chatroom_id,
                chatroom_name: event.chatroom_name,
            },
        })
        if (this.AlarmSseMap.get(event.to) === undefined)
            return {status: true, message: 'no client'};
        this.AlarmSseMap.get(event.to).next({data: alarm});
        return {status: true, message: 'success'};
    }
}