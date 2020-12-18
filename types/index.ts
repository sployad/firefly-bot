export type VKMessage = [number, number, number, number, number, string, string, { attach1_type: MessageContentType }?]
export type SendMessage = {
    peer_id: number,
    random_id: number,
    message: string
}

export enum MessageEventType {
    NEW_MESSAGE = 4,
    EDITED_MESSAGE = 5,
}

export enum MessageContentType {
    TEXT = 'text',
    AUDIO = 'audio',
    VIDEO = 'video',
    PHOTO = 'photo',
    STICKER = 'sticker',
    DOCUMENT = 'doc',
}

export type TelegramMessage = {}

type replyMessage = {
    (message: string): void
}


export type Context = {
    type?: MessageContentType,
    id: number
    message: string,
    from: number,
    date: string,
    reply: replyMessage,
    original: VKMessage | TelegramMessage
}
