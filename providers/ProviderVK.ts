import {Provider} from "./Provider";
import axios from 'axios';
import {VKMessage} from '../types';
import {fromArray} from 'rxjs/internal/observable/fromArray';
import {filter, map} from 'rxjs/operators';

export class ProviderVK extends Provider {
    private groupId: number = 0;
    private server: string = '';
    private key: string = '';
    private ts: string = '';
    private url: string = 'https://api.vk.com/method/';

    async initLongPoolingServer() {
        const data = await axios.get(`${this.url}messages.getLongPollServer?group_id=${this.groupId}&lp_version=3&access_token=${this.token}&v=5.103`).then(res => res.data.response);
        this.server = data.server;
        this.key = data.key;
        this.ts = data.ts;
    }

    async initUser() {
        try {
            const res = await axios.get(`${this.url}groups.getById?&access_token=${this.token}&v=5.103`);
            if (res.data.response) {
                this.groupId = res.data.response[0].id
                console.log('this.groupId', this.groupId)
            } else {
                throw res.data;
            }
        } catch (e) {
            console.log(e);
        }
    }

    async startPooling() {
        await this.initUser();
        await this.initLongPoolingServer();
        this.doRequest();
    }

    async doRequest(wait: number = 25) {
        try {
            const {
                ts,
                updates
            } = await axios.get(`https://${this.server}?act=a_check&key=${this.key}&ts=${this.ts}&wait=${wait}`).then(res => res.data);
            this.ts = ts;
            fromArray(updates as [[number, number, number, number, string, string]]).pipe(
                filter(((m: any) => m[0] == 4)),
                map((m: []) => this.createMessage.apply(null, [...m.slice(1), m] as any))).subscribe((val) => {
                this.newMessage$.next(val);
            })
            this.doRequest(wait)
            return;
        } catch (e) {
            this.doRequest(wait);
        }
    }

    async launch() {
        this.startPooling()
    }

}
