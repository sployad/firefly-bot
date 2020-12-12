import {Observable, Subject} from "rxjs";

export abstract class Provider {
    token: string = '';
    newMessage: Observable<any> = new Subject();
    public abstract startPooling(): void ;
}

export enum ProvidersList {
    VK= 'VK',
    TELEGRAM = 'TELEGRAM'
}
