import {actionList, MiddlewareInterface, recordAction} from './types';
import {Context} from '../types';

export class MessageMiddleware implements MiddlewareInterface {
    public commandList: actionList = {};
    public onList: actionList = {};
    public hearsList: actionList = {};

    async handle(ctx: Context) {
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
    };

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

    next!: MiddlewareInterface;

}
