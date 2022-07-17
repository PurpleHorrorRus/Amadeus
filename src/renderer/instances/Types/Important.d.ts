import { TProfile } from "./Conversation";
import { TMessage } from "./Messages";

export type TImportantMessage = {
    message: TMessage
    profile: TProfile
}