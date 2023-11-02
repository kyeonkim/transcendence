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
        // console.log('Alarm sse open', id);
        if (this.AlarmSseMap.get(id) !== undefined)
            return this.AlarmSseMap.get(id);
        const newEvent = new Subject<any>();
        this.AlarmSseMap.set(id, newEvent);
        req.on('close', (_) => {
            this.AlarmSseMap.delete(id);
            console.log('Alarm sse close', id);
        });
        return this.AlarmSseMap.get(id);
    }

    async FriendListSse(req, id: number) {
        // console.log('FriendList sse open', id, this.FriendListSseMap.size);
        if (this.FriendListSseMap.get(id) !== undefined)
            return this.FriendListSseMap.get(id);
        const newEvent = new Subject<any>();
        this.FriendListSseMap.set(id, newEvent);
        req.on('close', (_) => {
            this.FriendListSseMap.delete(id);
            console.log('FriendList sse close', id);
        });
        return this.FriendListSseMap.get(id);
    }

    async SendFriendEvent(id: number)
    {
        console.log('friend event', id);
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
            this.AlarmSseMap.get(id).next({data: events[i]});
        // console.log(events);
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
            console.log('DeleteAlarms error: ', error);
            return {status: false, message: 'DeleteAlarms failed'};
        }
    }

    async DeletAllAlarmsByNick(nick_name: string) {
        const user = await this.pismaService.user.findUnique({
            where: {
                nick_name: nick_name,
            },
        });
        if (user === null)
            return {status: false, message: 'no user'};
        await this.pismaService.event.deleteMany({
            where: {
                to_id: user.user_id,
            },
        });
        return {status: true, message: 'success'};
    }

    async SendEvent(event: eventDto) {
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