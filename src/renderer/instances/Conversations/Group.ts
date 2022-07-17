import { MessagesConversationWithMessage, GroupsGroupFull } from "vk-io/lib/api/schemas/objects";
import Group from "../Group";

import Conversation from "./Convesration";

class ConversationGroup extends Conversation {
    public isGroup: boolean = true;

    constructor(item: MessagesConversationWithMessage, group: GroupsGroupFull) {
        super(item);
        this.profile = new Group(group);
    }

    get name() {
        return this.profile.name;
    }
}

export default ConversationGroup;