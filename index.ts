import {ProvidersList} from "./providers/Provider";
import {ProviderBuilder} from "./providers/ProviderBuilder";

const provider = new ProviderBuilder()
    .setProvider(ProvidersList.VK)
    .setToken('123')
    .build()

provider.startPooling();

