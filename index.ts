import {ProvidersList} from "./providers/Provider";
import {ProviderBuilder} from "./providers/ProviderBuilder";
import {Observable, Subject} from 'rxjs';
import {Context} from './types';
import {Bot} from "./bot";
import {map} from "rxjs/operators";


async function start() {
    const provider = new ProviderBuilder()
        .setProvider(ProvidersList.VK)
        .setToken('')
        .build()

    const bot = new Bot();
    bot.on((ctx) => {
        if (ctx.message == 'Привет') {
            ctx.reply('Привет!');
        }
    });
    bot.addProvider(provider);
    bot.start();

}

start()
