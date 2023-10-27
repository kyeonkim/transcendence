import { Injectable } from '@nestjs/common';
import { Subject, map } from 'rxjs';

@Injectable()
export class EventService {
    private event: Subject<any>;
    private mapWithType = new Map<number, Subject<any>>();

    constructor() {}

    async sse(req, id: number) {
        if (this.mapWithType.get(id) !== undefined)
            return this.mapWithType.get(id);
        const newEvent = new Subject();
        this.mapWithType.set(id, newEvent);
        req.on('close', (_) => {this.mapWithType.delete(id)});
        return this.mapWithType.get(id);
    }

    async sendEventToAllClients(id: number) {
        if (this.mapWithType.get(id) === undefined)
            return false;
        this.mapWithType.get(id).next({data:"test"});
    }
}
