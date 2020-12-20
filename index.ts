import {ProvidersList} from "./providers/Provider";
import {ProviderBuilder} from "./providers/ProviderBuilder";
import {Context, MessageContentType} from './types';
import {Bot} from "./bot";


async function start() {

    const providerVK = new ProviderBuilder()
        .setProvider(ProvidersList.VK)
        .setToken('6a223391a574954e2cfffc1b0f4145b529a982d19fb5b947479f19db3a35abc29b4806eba53976e1aedf5')
        .build()

    const providerTelegram = new ProviderBuilder()
        .setProvider(ProvidersList.TELEGRAM)
        .setToken('395892005:AAGD-zdneHAPPHCD3EUq6r4kUwEkzy8pPpc')
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
    bot.addProvider(providerVK);
    bot.addProvider(providerTelegram);
    bot.start();

}

start()
