import {Provider} from "./Provider";
import axios from 'axios';
import {Context, MessageContentType, MessageEventType, SendMessage, VKMessage} from '../types';
import {fromArray} from 'rxjs/internal/observable/fromArray';
import {filter, map} from 'rxjs/operators';
import moment = require("moment");

export class ProviderVK extends Provider {
    private groupId: number = 0;
    private server: string = '';
    private key: string = '';
    private ts: string = '';
    private url: string = 'https://api.vk.com/method/';
    private messagesTypes: Array<MessageEventType> = [MessageEventType.NEW_MESSAGE, MessageEventType.EDITED_MESSAGE];

    private async initLongPoolingServer() {
        const data = await axios.get(`${this.url}messages.getLongPollServer?group_id=${this.groupId}&lp_version=3&access_token=${this.token}&v=5.103`).then(res => res.data.response);
        this.server = data.server;
        this.key = data.key;
        this.ts = data.ts;
    }

    private async initGroupId() {
        try {
            const res = await axios.get(`${this.url}groups.getById?&access_token=${this.token}&v=5.103`);
            if (res.data.response) {
                this.groupId = res.data.response[0].id
                console.log('this.groupId', this.groupId)
            } else {
                console.error(res.data);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async startPooling() {
        await this.initGroupId();
        await this.initLongPoolingServer();
        this.doRequest();
    }

    private async doRequest(wait: number = 25) {
        try {
            const {
                ts,
                updates
            } = await axios.get(`https://${this.server}?act=a_check&key=${this.key}&ts=${this.ts}&wait=${wait}&mode=2`).then(res => res.data);
            this.ts = ts;
            fromArray(updates as VKMessage[]).pipe(
                filter(((m: VKMessage) => this.messagesTypes.includes(m[0]) && m[2] != 3)),
                map((m: VKMessage) => this.createMessage(m))).subscribe((val) => {
                this.newMessage$.next(val);
            });
        } catch (e) {
            console.error('error', e)
        } finally {
            this.doRequest(wait);
        }
    }

    async launch() {
        this.startPooling()
    }

    async sendMessage(message: SendMessage, random_id: number = Date.now()) {
        console.log(message)
        await axios.get(`${this.url}messages.send`, {
            params: {
                access_token: this.token,
                v: 5.103,
                ...message,
                random_id
            }
        })
    }

    createMessage(original: VKMessage): Context {
        enum VKMessageFields {
            id = 1,
            from = 3,
            date = 4,
            message = 6,
            attachment = 7
        }

        return {
            type: original[VKMessageFields.attachment]?.attach1_type || MessageContentType.TEXT,
            id: original[VKMessageFields.id],
            from: original[VKMessageFields.from],
            date: moment.unix(original[VKMessageFields.date]).format('DD.MM.yyyy'),
            message: original[VKMessageFields.message],
            reply: (message: string) => {
                this.sendMessage({
                        peer_id: original[VKMessageFields.from],
                        message: message,
                    },
                    original[VKMessageFields.id] + 1,
                );
            },
            original
        }
    }

}
