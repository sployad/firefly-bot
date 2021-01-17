import {Provider} from "./Provider";
import {Context, MessageContentType, SendMessage, TelegramMessage} from '../types';
import axios from "axios";
import moment = require("moment");

export class ProviderTelegram extends Provider {
    private url = 'https://api.telegram.org/bot';


    startPooling(): void {
        console.log('telegram is starting')
    }

    async doRequest(updatedId: number = 0) {
        try {
            const {ok, result} = await axios.get(`${this.url}${this.token}/getUpdates?limit=1&offset=${updatedId}`).then(res => res.data);
            if (result.length) {
                let tgMessage = result[0].message as TelegramMessage;
                updatedId = result[0].update_id + 1;
                this.newMessage$.next(this.createMessage(tgMessage));
            }

        } catch (e) {
            console.error('error', e.message)
        } finally {
            this.doRequest(updatedId);
        }
    }

    launch(): void {
        this.doRequest();
    }

    createMessage(newMessage: TelegramMessage): Context {
        const messageType: keyof TelegramMessage = Object.keys(newMessage)[4] as keyof TelegramMessage;
        console.log(messageType)
        return {
            id: newMessage.message_id,
            message: newMessage[messageType],
            date: moment.unix(newMessage.date).format('DD.MM.yyyy'),
            type: messageType as MessageContentType,
            from: newMessage.from.id,
            reply: (message: string) => {
                this.sendMessage({
                    peer_id: newMessage.from.id,
                    random_id: -1,
                    message,
                });
            },
            original: newMessage
        }
    }

    async sendMessage(message: SendMessage) {
        const res = await axios.get(`${this.url}${this.token}/sendMessage`, {
            params: {
                chat_id: message.peer_id,
                text: message.message,
            }
        });
        console.log('RESULT', res);
    }
}
