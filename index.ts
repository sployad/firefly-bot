import {ProvidersList} from "./providers/Provider";
import {ProviderBuilder} from "./providers/ProviderBuilder";
import {Observable} from 'rxjs';


async function start(){
    const provider = new ProviderBuilder()
        .setProvider(ProvidersList.VK)
        .setToken('')
        .build()

    // @ts-ignore
    await provider.launch()
    provider.newMessage.subscribe(console.log)

}

start()
