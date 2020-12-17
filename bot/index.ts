import {Provider} from '../providers/Provider';
import {Context} from "../types";
import {Observable, Subject} from "rxjs";

type callbackBot = {
    (ctx: Context): void
}

type onBot = {
    <T>(cb?: T): T extends Function ? Bot : Subject<Context>;
    <T>(type: string, cb?: T): T extends Function ? Bot : Subject<Context>;
}

type hearsBot = {
    (regex: RegExp, cb: callbackBot): Bot
}

type commandBot = {
    (command: string, cb: callbackBot): Bot
}

interface BotInterface {
    onList: Record<string, (callbackBot | Subject<Context>)[]>,
    providers: Provider[];
    start: Function;
}

export class Bot implements BotInterface {
    on: onBot = (cbOrType?: (callbackBot | string), cb?: callbackBot): Bot | Subject<Context> => {
        if (typeof cbOrType == 'string') {
            return new Subject<Context>()
        }
        return this;
    }

    addProvider(provider: Provider): Bot {
        provider.newMessage$.subscribe({
            next: this.messageHandler.bind(this)
        });
        this.providers.push(provider);
        return this;
    }

    private messageHandler(ctx: Context) {
        this.onList['text'].forEach((cb: callbackBot | Subject<Context>) => {
            if (cb instanceof Subject) {
                cb.next(ctx);
            } else {
                cb(ctx);
            }
        });
    }

    start(): void {
        if (!this.providers.length) {
            console.error('Provider list is empty');
            return;
        }
        this.providers.forEach(p => p.launch());
    }

    // commandList: commandBot[];
    // hears: hearsBot;
    // hearsList: hearsBot[];
    // on: onBot;
    providers: Provider[] = [];
    onList: Record<string, (callbackBot | Subject<Context>)[]> = {};

}

