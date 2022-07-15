import { MessagesForeignMessage } from "vk-io/lib/api/schemas/objects";
        
export type ConversationMessageType = MessagesForeignMessage & {
    out: boolean | number
};