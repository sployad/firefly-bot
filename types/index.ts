export type VKMessage = {
    ts: number,
    flag: VKMessageFlag,
    fromID: number,
    date: number,
    title: string,
    message: string
}

export enum VKMessageFlag {
    UNREAD = 1,
    OUTBOX = 2,
    REPLIED = 8,
    CHAT = 16,
    FRIENDS = 32,
    SPAM = 64,
    DELETED = 128,
    FIXED = 256,
    MEDIA = 512,
    HIDDEN = 65536,
}

export type TelegramMessage = {

}

export type Context = {
    id: number
    message: string,
    from: number,
    date: string,
    original: VKMessage | TelegramMessage
}
