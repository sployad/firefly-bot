import {Context, MessageContentType} from '../types';
import {Subject} from 'rxjs';
import {Bot} from './index';

export type callbackBot = {
    (ctx: Context): void
};
export type onHook = {
    <T>(type: MessageContentType, cb?: T): T extends callbackBot ? Bot : Subject<Context>;
    <T>(cb?: T): T extends callbackBot ? Bot : Subject<Context>;
};
export type commandHook = {
    <T>(command: string): T extends callbackBot ? Bot : Subject<Context>;
    <T>(command: string, cb?: T): T extends callbackBot ? Bot : Subject<Context>
};
export type hearsHook = {
    <T>(regex: RegExp): T extends callbackBot ? Bot : Subject<Context>;
    <T>(regex: RegExp, cb?: T): T extends callbackBot ? Bot : Subject<Context>;
};
export type MiddlewareHandle = {
    <T>(ctx: Context & T, next: MiddlewareNextFn): Promise<void>,
};
export type MiddlewareNextFn = {
    (): Promise<void>
}
export type recordAction = {
    callbacks: callbackBot[] | null,
    subject: Subject<Context> | null
};
export type actionList = Record<string, recordAction>;

export interface MiddlewareInterface {
    next: MiddlewareInterface
    handle: (ctx: Context & any) => Promise<void>;
}

export class UserMiddleware implements MiddlewareInterface {
    next!: MiddlewareInterface;
    userFn!: MiddlewareHandle;

    async handle(ctx: Context & any) {
        await this.userFn(ctx, () => this.next.handle(ctx));
    };
}
