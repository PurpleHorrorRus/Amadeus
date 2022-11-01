import { GroupsGroupFull, MessagesConversationWithMessage, UsersUserFull } from "vk-io/lib/api/schemas/objects";
import { TProfile } from "./Types/Conversation";

import Group from "./Group";
import User from "./User";

import ConversationUser from "./Conversations/User";
import ConversationGroup from "./Conversations/Group";
import ConversationChat from "./Conversations/Chat";
import Conversation from "./Conversations/Convesration";

class ProfileGenerator {
    static findProfile(id, array: Array<UsersUserFull | GroupsGroupFull>): UsersUserFull | GroupsGroupFull {
        return array.find(profile => {
            return profile.id === id;
        });
    }

    static generate(id: number, profiles: UsersUserFull[], groups: GroupsGroupFull[]): TProfile {
        const user: UsersUserFull = ProfileGenerator.findProfile(id, profiles) as UsersUserFull;
        if (user) {
            return new User(user);
        }

        const group: GroupsGroupFull = ProfileGenerator.findProfile(Math.abs(id), groups) as GroupsGroupFull;
        return new Group(group);
    }

    static conversationProfileByType(
        type: string,
        item: MessagesConversationWithMessage,
        profiles: UsersUserFull[],
        groups: GroupsGroupFull[]
    ): Conversation {
        const id = Math.abs(item.last_message.peer_id);

        switch (type) {
            case "user": {
                const profile: UsersUserFull = ProfileGenerator.findProfile(id, profiles) as UsersUserFull;
                return new ConversationUser(item, profile);
            }

            case "group": case "page": {
                const group: GroupsGroupFull = ProfileGenerator.findProfile(id, groups) as GroupsGroupFull;
                return new ConversationGroup(item, group);
            }

            case "chat": {
                return new ConversationChat(item);
            }
        }
    }

    static asObjects(
        profiles: UsersUserFull[] | GroupsGroupFull[],
        type: "user" | "group"
    ): Record<TProfile["id"], TProfile> {
        if (!profiles) {
            return {};
        }

        const rProfiles = {};

        profiles.map(profile => {
            rProfiles[profile.id] = type === "user"
                ? new User(profile)
                : new Group(profile);

            return rProfiles[profile.id];
        });

        return rProfiles;
    }
}

export default ProfileGenerator;