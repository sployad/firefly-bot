export type VKMessage = [number, number, number, number, number, string, string]
export type SendMessage = {
    peer_id: number,
    random_id: number,
    message: string
}
export enum MessageType {
    NEW_MESSAGE = 4,
    EDITED_MESSAGE = 5,
}

export type TelegramMessage = {
}

type replyMessage = {
    (message: string): void
}

export type Context = {
    id: number
    message: string,
    from: number,
    date: string,
    reply: replyMessage,
    original: VKMessage | TelegramMessage
}
