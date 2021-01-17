import {ProvidersList} from "./providers/Provider";
import {ProviderBuilder} from "./providers/ProviderBuilder";
import {Context, MessageContentType} from './types';
import {Bot} from "./bot";
import {MiddlewareHandle, MiddlewareNextFn} from './bot/types';

async function start() {

    const providerVK = new ProviderBuilder()
        .setProvider(ProvidersList.VK)
        .setToken('')
        .build()

    const providerTelegram = new ProviderBuilder()
        .setProvider(ProvidersList.TELEGRAM)
        .setToken('')
        .build()

    const providerQuestBot = new ProviderBuilder()
        .setProvider(ProvidersList.TELEGRAM)
        .setToken('')
        .build()

    const bot = new Bot();

    bot.use((ctx: Context & any, next: MiddlewareNextFn) => {
        ctx.name = 'Дорогой';
        ctx.sname = 'гость';
        next();
    });

    bot.on((ctx: Context & any) => {
        if (ctx.message == 'Привет') {
            ctx.reply(`Привет, ${ctx.name} ${ctx.sname}!`);
        }
    });

    bot.on(MessageContentType.STICKER, (ctx: Context) => {
        ctx.reply('Спасибо за стикер')
    });

    bot.command('start', (ctx: Context) => {
        ctx.reply('Давай начнем');
    });

    bot.hears(/\+?7\(?\d{3}\)?\d{7}/, (ctx: Context) => {
        const phone = ctx.message.match(/\+?7\(?\d{3}\)?\d{7}/)!.values().next().value;
        ctx.reply(`Хорошо, я позвоню тебе на ${phone}`)
    });

    bot.addProvider(providerVK, providerTelegram, providerQuestBot);
    bot.start();

}

start()
