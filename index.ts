import {ProvidersList} from "./providers/Provider";
import {ProviderBuilder} from "./providers/ProviderBuilder";
import {Context, MessageContentType} from './types';
import {Bot} from "./bot";


async function start() {

    const providerVK = new ProviderBuilder()
        .setProvider(ProvidersList.VK)
        .setToken('')
        .build()

    const providerTelegram = new ProviderBuilder()
        .setProvider(ProvidersList.TELEGRAM)
        .setToken('')
        .build()

    const providerQuestBot= new ProviderBuilder()
        .setProvider(ProvidersList.TELEGRAM)
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
    bot.command('start', (ctx: Context) => {
        ctx.reply('Давай начнем');
    });
    bot.hears(/\+?7\(?\d{3}\)?\d{7}/, (ctx: Context) => {
        const phone = ctx.message.match(/\+?7\(?\d{3}\)?\d{7}/)!.values().next().value;
        ctx.reply(`Хорошо, я позвоню тебе на ${phone}`)
    })
    bot.addProvider(providerVK, providerTelegram, providerQuestBot);
    bot.start();

}

start()
