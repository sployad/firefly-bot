export type VKMessage = [number, number, number, number, number, string, string, { attach1_type: MessageContentType }?]
export type SendMessage = {
    peer_id: number,
    message: string
}
export type TelegramMessage = {
    message_id: number,
    from: {
        id: number,
        is_bot: boolean,
        first_name: string,
        last_name: string,
        username: string,
        language_code: string
    },
    chat: {
        id: number,
        first_name: string,
        last_name: string,
        username: string,
        type: string
    }
    date: number
    text?: string
    photo?: any,
    video?: any,
    audio?: any,
    voice?: any
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

type replyMessage = {
    (message: string): void
}


export type Context = {
    type?: MessageContentType,
    id: number
    message: any,
    from: number,
    date: string,
    reply: replyMessage,
    original: VKMessage | TelegramMessage,
}
