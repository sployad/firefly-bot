import {Provider, ProvidersList} from "./Provider";
import {ProviderVK} from "./ProviderVK";
import {ProviderTelegram} from "./ProviderTelegram";


export class ProviderBuilder {
    protected providerType: ProvidersList | null = null;
    protected token: string = '';

    setProvider(providerType: ProvidersList): ProviderBuilderWithProvider {
        return new ProviderBuilderWithProvider().setProvider(providerType);
    }
}

class ProviderBuilderWithProvider extends ProviderBuilder {
    setProvider(providerType: ProvidersList): ProviderBuilderWithProvider {
        this.providerType = providerType;
        return this;
    }
    setToken(token: string): ProviderBuilderWithToken {
        return new ProviderBuilderWithToken().setProvider(this.providerType!).setToken(token);
    }
}

class ProviderBuilderWithToken extends ProviderBuilderWithProvider {
    setToken(token: string): ProviderBuilderWithToken{
        this.token = token;
        return this;
    }
    build(): Provider {
        let provider: Provider;
        if (this.providerType == ProvidersList.VK) {
            provider = new ProviderVK();
        } else {
            provider = new ProviderTelegram();
        }
        provider.token = this.token;
        return provider;
    }
}
