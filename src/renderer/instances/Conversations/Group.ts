import { MessagesConversationWithMessage, GroupsGroupFull } from "vk-io/lib/api/schemas/objects";

import Conversation from "./Convesration";

class ConversationGroup extends Conversation {
    public isGroup: boolean = true;

    constructor(item: MessagesConversationWithMessage, groups: GroupsGroupFull[]) {
        super(item);

        this.profile = groups.find(group => {
            return -Math.abs(group.id) === item.conversation.peer.id;
        });
    }

    get name() {
        return this.profile.name;
    }
}

export default ConversationGroup;