import {
    MessagesConversationWithMessage,
    UsersUserFull
} from "vk-io/lib/api/schemas/objects";

import User from "../User";

import Conversation from "./Convesration";

class ConversationUser extends Conversation {
    public isUser: boolean = true;

    constructor(item: MessagesConversationWithMessage, profile: UsersUserFull) {
        super(item);
        this.profile = new User(profile);
    }

    get name(): string { 
        return this.profile.name;
    }
}

export default ConversationUser;