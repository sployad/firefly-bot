import {Provider} from "./Provider";
import {Context, SendMessage, TelegramMessage} from '../types';

export class ProviderTelegram extends Provider {
    startPooling(): void {
        console.log('telegram is starting')
    }

    launch(): void {
    }

    createMessage(args: TelegramMessage): Context {
        return {} as Context;
    }

    sendMessage(message: SendMessage): void {
    }
}
