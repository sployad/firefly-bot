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
        console.log(ctx.type)
        ctx.reply('Спасибо за стикер')
    });
    bot.command('start').subscribe(
        {
            next: (ctx: Context) => {
                ctx.reply('Давай начнем');
            }
        }
    );
    bot.hears(/\+?7\(?\d{3}\)?\d{7}/, (ctx: Context) => {
        const phone = ctx.message.match(/\+?7\(?\d{3}\)?\d{7}/)!.values().next().value;
        ctx.reply(`Хорошо, я позвоню тебе на ${phone}`)
    })
    bot.addProvider(provider);
    bot.start();

}

start()
