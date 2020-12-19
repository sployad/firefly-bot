import {Provider} from '../providers/Provider';
import {Context, MessageContentType} from "../types";
import {Observable, Subject} from "rxjs";

type callbackBot = {
    (ctx: Context): void
}

//Возможно объединить типы onBot , commandBot , hearsBot на <T,U>(param: T, cb: U) U extends callbackBot ? Bot : Subject<Context>
type onBot = {
    <T>(type: MessageContentType, cb?: T): T extends callbackBot ? Bot : Subject<Context>;
    <T>(cb?: T): T extends callbackBot ? Bot : Subject<Context>;
};
type commandBot = {
    <T>(command: string): T extends callbackBot ? Bot : Subject<Context>;
    <T>(command: string, cb?: T): T extends callbackBot ? Bot : Subject<Context>
};
type BotActionList = Record<string, (callbackBot | Subject<Context>)[]>;

type hearsBot = {
    <T>(regex: RegExp): T extends callbackBot ? Bot : Subject<Context>;
    <T>(regex: RegExp, cb?: T): T extends callbackBot ? Bot : Subject<Context>;
}


export class Bot {
    on: onBot = (cbOrType?: (callbackBot | MessageContentType), cb?: callbackBot): Bot | Subject<Context> => {
        if (typeof cbOrType == 'string') {
            if (!this.onList[cbOrType]) this.onList[cbOrType] = [];
            if (cb) {
                this.onList[cbOrType].push(cb);
                return this;
            } else {
                const sub = new Subject<Context>();
                this.onList[cbOrType].push(sub);
                return sub;
            }
        }
        if (cbOrType) {
            if (!this.onList['text']) this.onList['text'] = [];
            this.onList['text'].push(cbOrType);
            return this;
        } else {
            const sub = new Subject<Context>();
            this.onList['text'].push(sub);
            return sub;
        }
    }
    command: commandBot = (command: string, cb?: callbackBot): Bot | Subject<Context> => {
        if (!this.commandList[command]) this.commandList[command] = [];
        if (cb) {
            this.commandList[command].push(cb);
            return this;
        } else {
            const sub = new Subject<Context>();
            this.commandList[command].push(sub);
            return sub;
        }
    }
    hears: hearsBot = (regex: RegExp, cb?: callbackBot): Bot | Subject<Context> => {
        const hearsKey = regex.toString().slice(1,-1);
        if (!this.hearsList[hearsKey]) this.hearsList[hearsKey] = [];
        if (cb) {
            this.hearsList[hearsKey].push(cb);
            return this;
        } else {
            const sub = new Subject<Context>()
            this.hearsList[hearsKey].push(sub);
            return sub;
        }
    }

    addProvider(provider: Provider): Bot {
        provider.newMessage$.subscribe({
            next: this.messageHandler.bind(this)
        });
        this.providers.push(provider);
        return this;
    }

    private onHandler(ctx: Context) {
        Object.keys(this.onList)
            .filter(type => type == ctx.type)
            .forEach(type => {
                this.onList[type].forEach((cb: callbackBot | Subject<Context>) => {
                    if (cb instanceof Subject) {
                        cb.next(ctx);
                    } else {
                        cb(ctx);
                    }
                })
            });
    }

    private commandHandler(ctx: Context) {
        let command: string = ctx.message.match(/^\/\w+/i)!
            .values()
            .next()
            .value
            .slice(1);

        Object.keys(this.commandList)
            .filter((comm: string) => comm == command)
            .forEach(comm => {
                this.commandList[comm].forEach((cb: callbackBot | Subject<Context>) => {
                    if (cb instanceof Subject) {
                        cb.next(ctx);
                    } else {
                        cb(ctx);
                    }
                })
            });
    }

    private hearsHandler(hears: (callbackBot | Subject<Context>)[], ctx: Context) {
        hears.forEach((cb) => {
            if (cb instanceof Subject) {
                cb.next(ctx);
            } else {
                cb(ctx);
            }
        })
    }

    private messageHandler(ctx: Context) {
        if (/^\/\w+/i.test(ctx.message)) {
            this.commandHandler(ctx);
            return;
        }
        const hears = Object.keys(this.hearsList).find(rgx => {

            return new RegExp(rgx).test(ctx.message)
        });
        console.log('hears', hears)
        if (hears) {
            this.hearsHandler(this.hearsList[hears], ctx);
        } else {
            this.onHandler(ctx);
        }
    }

    start(): void {
        if (!this.providers.length) {
            console.error('Provider list is empty');
            return;
        }
        this.providers.forEach(p => p.launch());
    }

    protected commandList: BotActionList = {};
    protected onList: BotActionList = {};
    protected providers: Provider[] = [];
    protected hearsList: BotActionList = {};
}

