import {ProvidersList} from "./providers/Provider";
import {ProviderBuilder} from "./providers/ProviderBuilder";
import {Context, MessageContentType} from './types';
import {Bot} from "./bot";


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
    bot.on(MessageContentType.STICKER, (ctx: Context) => {
        ctx.reply('Спасибо за стикер')
    });
    bot.addProvider(provider);
    bot.start();

}

start()
