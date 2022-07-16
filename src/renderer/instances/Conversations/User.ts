import {
    MessagesConversationWithMessage,
    UsersUserFull
} from "vk-io/lib/api/schemas/objects";

import User from "../User";

import Conversation from "./Convesration";

class ConversationUser extends Conversation {
    public isUser: boolean = true;

    constructor(item: MessagesConversationWithMessage, profiles: UsersUserFull[]) {
        super(item);

        const profile = profiles.find(profile => {
            return profile.id === item.conversation.peer.id;
        });

        this.profile = new User(profile);
    }

    get name(): string { 
        return this.profile.name;
    }
}

export default ConversationUser;