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
    bot.on((ctx: Context) => {
        if (ctx.message == 'Привет') {
            ctx.reply('Привет!');
        }
    });
    bot.on().subscribe(
        {
            next: (ctx: Context) => {
                if (ctx.message == 'как дела?')
                    ctx.reply('Нормально, твои как?')
            }
        }
    )
    bot.addProvider(provider);
    bot.start();

}

start()
