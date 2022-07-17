import { MessagesMessage } from "vk-io/lib/api/schemas/objects";

import Conversation from "../Conversations/Convesration";
import Message from "../Messages/Message";
import { TMap } from "./Attachments";

export type TChat = {
    id: number
    count: number
    search: boolean
    messages: Message[]
    conversation: Conversation
}

export type TMessage = MessagesMessage & {
    syncing?: boolean | number
    geo?: TMap
}