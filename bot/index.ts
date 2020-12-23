import {Provider} from '../providers/Provider';
import {Context, MessageContentType} from "../types";
import {Subject} from "rxjs";
import {actionList, callbackBot, commandHook, hearsHook, onHook, recordAction} from './types';

export class Bot {
    on: onHook = (cbOrType?: (callbackBot | MessageContentType), cb?: callbackBot): Bot | Subject<Context> => {
        if (typeof cbOrType == 'string') {
            return this.addNewHandler(cbOrType, this.onList, cb);
        }
        return this.addNewHandler(MessageContentType.TEXT, this.onList, cbOrType);
    }

    command: commandHook = (command: string, cb?: callbackBot): Bot | Subject<Context> => {
        return this.addNewHandler(command, this.commandList, cb);
    }

    hears: hearsHook = (regex: RegExp, cb?: callbackBot): Bot | Subject<Context> => {
        const hearsKey = regex.toString().slice(1, -1);
        return this.addNewHandler(hearsKey, this.hearsList, cb);
    }

    addProvider(...providers: Provider[]): Bot {
        providers.forEach(provider => {
            provider.newMessage$.subscribe({
                next: this.messageHandler.bind(this)
            });
            this.providers.push(provider);
        })
        return this;
    }

    start(): void {
        if (!this.providers.length) {
            console.error('Provider list is empty');
            return;
        }
        this.providers.forEach(p => p.launch());
    }

    private addNewHandler(key: string, list: actionList, cb?: callbackBot): Bot | Subject<Context> {
        if (!list[key]) list[key] = {callbacks: null, subject: null}
        if (cb) {
            if (list[key].callbacks == null) list[key].callbacks = [];
            list[key].callbacks!.push(cb);
            return this;
        } else {
            if (list[key].subject == null) list[key].subject = new Subject<Context>();
            return list[key].subject!;
        }
    }

    private provideToHandlers(item: recordAction, ctx: Context) {
        if (item.callbacks != null) {
            item.callbacks.forEach(cb => cb(ctx));
        }
        if (item.subject) item.subject.next(ctx);
    }

    private onHandler(ctx: Context) {
        Object.keys(this.onList)
            .filter(type => type == ctx.type)
            .forEach(type => this.provideToHandlers(this.onList[type], ctx));
    }

    private commandHandler(ctx: Context) {
        let command: string = ctx.message.match(/^\/\w+/i)!
            .values()
            .next()
            .value
            .slice(1);

        Object.keys(this.commandList)
            .filter((comm: string) => comm == command)
            .forEach(comm => this.provideToHandlers(this.commandList[comm], ctx));
    }

    private messageHandler(ctx: Context) {
        if (/^\/\w+/i.test(ctx.message)) {
            this.commandHandler(ctx);
            return;
        }
        const hears = Object.keys(this.hearsList).find(rgx => new RegExp(rgx).test(ctx.message));
        if (hears) {
            this.provideToHandlers(this.hearsList[hears], ctx);
        } else {
            this.onHandler(ctx);
        }
    }

    private commandList: actionList = {};
    private onList: actionList = {};
    private providers: Provider[] = [];
    private hearsList: actionList = {};
}

