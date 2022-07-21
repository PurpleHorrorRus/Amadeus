import lodash from "lodash";

import {
    MessagesConversationWithMessage,
    MessagesConversation
} from "vk-io/lib/api/schemas/objects";

import { TProfile } from "../Types/Conversation";
import { ConversationMessageType } from "../Types/ConversationMessage";

const mentionRegex = /\[id(.*?)\|@(.*?)\]/;

abstract class Conversation {
    [x: string]: any;

    public message: ConversationMessageType;
    public profile: TProfile;
    public information: MessagesConversation;
    public id: number;
    public type: string;

    public pinned: boolean = false;
    public muted: boolean = false;
    public mention: boolean = false;
    public restricted: boolean = false;

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
        this.restricted = !item.conversation.can_write.allowed;
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

        if (!message.out) {
            this.information.unread_count++;
        }
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

    setProfile(profile: TProfile): void {
        this.profile = profile;
    }

    readIn(id: number): void {
        this.information.unread_count = 0;
        this.information.in_read = id;
    }

    readOut(id: number): void {
        this.information.out_read = id;
    }

    updateAvatar(avatar: string): void {
        this.profile.photo_100 = avatar;
    }

    restrict(restricted: boolean = true) {
        this.restricted = restricted;
    }
    
    get name(): string { 
        return "none";
    }

    get avatar(): string {
        return this.profile.photo_100 || "https://vk.com/images/camera_100.png";
    }

    get isTyping(): boolean {
        return (this.isUser || this.isGroup)
            && this.typing.enable;
    }
}

export default Conversation;