import {ProvidersList} from "./providers/Provider";
import {ProviderBuilder} from "./providers/ProviderBuilder";
import {Observable} from 'rxjs';
import {Context} from './types';


async function start() {
    const provider = new ProviderBuilder()
        .setProvider(ProvidersList.VK)
        .setToken('')
        .build()

    provider.newMessage$.subscribe({
        next(ctx: Context) {
            ctx.reply('И тебе привет');
        }
    })
    await provider.launch()

}

start()
