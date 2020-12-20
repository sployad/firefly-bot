import moment = require("moment");
import {Observable, Subject} from "rxjs";
import {Context, SendMessage, TelegramMessage, VKMessage} from '../types';

export abstract class Provider {
    token: string = '';
    newMessage$: Subject<any> = new Subject<any>()
    protected sessions: Record<number, Record<string, any>> = {};

    protected abstract startPooling(interval: number): void ;

    abstract launch(): void;

    abstract createMessage(args: any): Context

    abstract sendMessage(message: SendMessage): void
}

export enum ProvidersList {
    VK = 'VK',
    TELEGRAM = 'TELEGRAM'
}

export type createMessageType = {}
