import {
    MessagesConversationWithMessage,
    MessagesChatFull
} from "vk-io/lib/api/schemas/objects";

import Conversation from "./Convesration";
import ChatUser from "./ChatUser";

class ConversationChat extends Conversation {
    public isChat: boolean = true;
    public local_id?: number;
    public profile: MessagesChatFull;
    public users?: ChatUser[];

    constructor(item: MessagesConversationWithMessage) {
        super(item);

        this.profile = item.profile;

        this.local_id = item.profile.id;
        console.log(this.profile.users);
        
        this.users = this.profile.users.map(user => { 
            return new ChatUser(user);
        });

        delete this.profile.users;
    }

    addUser(user: any): ChatUser[] {
        this.users.push(new ChatUser(user));
        return this.users;
    }

    removeUser(member_id: number): ChatUser[] { 
        const userIndex = this.users.findIndex(user => {
            return user.id === member_id;
        });

        this.users.splice(userIndex, 1);
        return this.users;
    }

    triggerTyping(from_id: number): void {
        const chatUser: ChatUser = this.users.find(chatUser => {
            return chatUser.id === from_id;
        });

        chatUser.typing.enable = true;
        return chatUser.typing.debounce();
    }

    updateTitle(title: string): void {
        this.profile.title = title;
    }

    get name(): string { 
        return this.profile.title;
    }

    get writers(): ChatUser[] { 
        return this.users.filter(user => {
            return user.typing.enable;
        });
    }
}

export default ConversationChat;