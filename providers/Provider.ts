import moment = require("moment");
import {Observable, Subject} from "rxjs";
import {Context, TelegramMessage, VKMessage} from '../types';

export abstract class Provider {
    token: string = '';
    newMessage$: Subject<any> = new Subject<any>()

    protected abstract startPooling(interval: number): void ;

    abstract launch(): void;

    createMessage(id: number, ts: number, from: number, date: number, title: string, message: string, original: VKMessage | TelegramMessage): Context {
        return {
            id,
            message,
            from,
            date: moment.unix(date).format('DD.MM.yyyy'),
            original
        }
    }
}

export enum ProvidersList {
    VK = 'VK',
    TELEGRAM = 'TELEGRAM'
}
