import {Provider} from '../providers/Provider';
import {Context, MessageContentType} from "../types";
import {Subject} from "rxjs";
import {
    actionList,
    callbackBot,
    commandHook,
    hearsHook,
    UserMiddleware,
    MiddlewareInterface,
    onHook,
} from './types';
import {MessageMiddleware} from './MessageMiddleware';

export class Bot {

    private readonly _middlewareMessage = new MessageMiddleware();

    use(handle: any) {
        const middleware = new UserMiddleware();
        middleware.userFn = handle;
        if (this.middlewares.length) {
            this.middlewares[this.middlewares.length - 1].next = middleware;
        }
        this.middlewares.push(middleware)
    }

    on: onHook = (cbOrType?: (callbackBot | MessageContentType), cb?: callbackBot): Bot | Subject<Context> => {
        if (typeof cbOrType == 'string') {
            return this.addNewHandler(cbOrType, this._middlewareMessage.onList, cb);
        }
        return this.addNewHandler(MessageContentType.TEXT, this._middlewareMessage.onList, cbOrType);
    }

    command: commandHook = (command: string, cb?: callbackBot): Bot | Subject<Context> => {
        return this.addNewHandler(command, this._middlewareMessage.commandList, cb);
    }

    hears: hearsHook = (regex: RegExp, cb?: callbackBot): Bot | Subject<Context> => {
        const hearsKey = regex.toString().slice(1, -1);
        return this.addNewHandler(hearsKey, this._middlewareMessage.hearsList, cb);
    }

    addProvider(...providers: Provider[]): Bot {
        providers.forEach(provider => {

            provider.newMessage$.subscribe({
                next: (ctx) => this.middlewares[0].handle(ctx)
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
        if (this.middlewares.length) {
            this.middlewares[this.middlewares.length - 1].next = this._middlewareMessage;
        } else {
            this.middlewares.push(this._middlewareMessage);
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

    private providers: Provider[] = [];
    private middlewares: MiddlewareInterface[] = [];
}

