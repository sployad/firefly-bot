import {Provider} from "./Provider";
import {from, Observable, of, timer} from "rxjs";
import axios from 'axios';
import {map, switchMap} from 'rxjs/operators';

export class ProviderVK extends Provider {
    private groupId: number = 0;
    private server: string = '';
    private key: string = '';
    private ts: string = '';
    private url: string = 'https://api.vk.com/method/';

    async initLongPoolingServer() {
        const data = await axios.get(`${this.url}messages.getLongPollServer?group_id=${this.groupId}&lp_version=3&access_token=${this.token}&v=5.103`).then(res => res.data.response);
        console.log('long pooling');
        this.server = data.server;
        this.key = data.key;
        this.ts = data.ts;
    }

    async initUser() {
        try {
            const res = await axios.get(`${this.url}groups.getById?&access_token=${this.token}&v=5.103`);
            if (res.data.response) {
                this.groupId = res.data.response[0].id
            } else {
                throw res.data;
            }
        } catch (e) {
            console.log(e);
        }
    }

    startPooling(interval: number = 25000) {
        const wait = Math.round(interval / 1000);
        return timer(0, interval).pipe(switchMap(_ => this.doRequest(wait)));
    }

    doRequest(wait: number = 25) {
        return from((axios.get(`https://${this.server}?act=a_check&key=${this.key}&ts=${this.ts}&wait=${wait}`)))
            .pipe(
                switchMap(_ => {
                    console.log(_.data)
                    this.ts = _.data.ts;
                    return of(_.data.updates)
                })
            );
    }

    async launch() {
        await this.initUser();
        await this.initLongPoolingServer();
        this.newMessage = this.startPooling();
    }

}
