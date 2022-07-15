import lodash from "lodash";

import {
    MessagesConversationWithMessage,
    MessagesConversation,
    UsersUserFull,
    GroupsGroupFull,
    MessagesChatFull
} from "vk-io/lib/api/schemas/objects";

import { ConversationMessageType } from "./types/ConversationMessage";

type ProfileType = UsersUserFull | GroupsGroupFull | MessagesChatFull;

const mentionRegex = /\[id(.*?)\|@(.*?)\]/;

abstract class Conversation {
    [x: string]: any;

    public message: ConversationMessageType;
    public profile: ProfileType;
    public information: MessagesConversation;
    public id: number;
    public type: string;

    public pinned: boolean = false;
    public muted: boolean = false;
    public mention: boolean = false;

    public isUser: boolean = false;
    public isGroup: boolean = false;
    public isChat: boolean = false;

    public typing: {
        enable: boolean
        debounce: Function
    };
    
    constructor(item: MessagesConversationWithMessage) {
        item.conversation.unread_count = item.conversation.unread_count || 0;

        this.message = item.last_message;
        this.information = item.conversation;
        this.id = item.conversation.peer.id;
        this.type = item.conversation.peer.type;

        this.pinned = item.conversation.sort_id.major_id !== 0;
        this.muted = item.muted;
        this.mention = mentionRegex.test(this.message.text);

        this.typing = {
            enable: false,
            debounce: lodash.debounce(function () { 
                this.enable = false;
            }, 6000)
        };
    }

    addMessage(message: ConversationMessageType) {
        this.setMessage(message);
        this.updateMention(message.text);
        this.stopTyping();
    }

    setMessage(message: ConversationMessageType): void { 
        this.message = message;
        this.setLastMessageId(message.id);
    }

    setLastMessageId(id: number): void {
        this.information.last_message_id = id;
    }

    updateMention(text: string): boolean { 
        this.mention = mentionRegex.test(text);
        return this.mention;
    }

    setOnline(online, online_mobile): void { 
        this.profile.online = online;
        this.profile.online_mobile = online_mobile;
    }

    triggerTyping(..._args: any): void { 
        this.typing.enable = true;
        this.typing.debounce();
    }

    stopTyping(): void { 
        this.typing.enable = false;
    }

    setMute(muted: boolean): void {
        this.muted = muted;
    }

    setProfile(profile: ProfileType): void {
        this.profile = profile;
    }

    updateAvatar(avatar: string): void {
        this.profile.photo_100 = avatar;
    }
    
    get name(): string { 
        return "none";
    }

    get avatar(): string {
        return this.profile.photo_100 || "https://vk.com/images/camera_100.png";
    }
}

export default Conversation;