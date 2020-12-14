import {Observable, Subject} from "rxjs";

export abstract class Provider {
    token: string = '';
    newMessage: Observable<any> = new Observable<any>();
    protected abstract startPooling(interval: number): void ;
    abstract launch(): void;
}

export enum ProvidersList {
    VK= 'VK',
    TELEGRAM = 'TELEGRAM'
}
