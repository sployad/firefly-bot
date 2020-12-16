import {ProvidersList} from "./providers/Provider";
import {ProviderBuilder} from "./providers/ProviderBuilder";
import {Observable} from 'rxjs';


async function start() {
    const provider = new ProviderBuilder()
        .setProvider(ProvidersList.VK)
        .setToken('6a223391a574954e2cfffc1b0f4145b529a982d19fb5b947479f19db3a35abc29b4806eba53976e1aedf5')
        .build()

    provider.newMessage$.subscribe({
        next(val) {
            console.log('val =', val)
        }
    })
    await provider.launch()

}

start()
