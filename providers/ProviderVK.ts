import {Provider} from "./Provider";
import {timer} from "rxjs";

export class ProviderVK extends Provider {
    startPooling(interval: number = 5000) {
        console.log('vk is starting')
    }

}
