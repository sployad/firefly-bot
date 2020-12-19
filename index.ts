import {ProvidersList} from "./providers/Provider";
import {ProviderBuilder} from "./providers/ProviderBuilder";
import {Context, MessageContentType} from './types';
import {Bot} from "./bot";


async function start() {
    const provider = new ProviderBuilder()
        .setProvider(ProvidersList.VK)
        .setToken('6a223391a574954e2cfffc1b0f4145b529a982d19fb5b947479f19db3a35abc29b4806eba53976e1aedf5')
        .build()

    const bot = new Bot();
    bot.on((ctx: Context) => {
        if (ctx.message == 'Привет') {
            ctx.reply('Привет!');
        }
    });
    bot.on(MessageContentType.STICKER, (ctx: Context) => {
        console.log(ctx.type)
        ctx.reply('Спасибо за стикер')
    });
    bot.addProvider(provider);
    bot.start();

}

start()
