import lodash from "lodash";

import {
    MessagesConversationWithMessage,
    MessagesConversation
} from "vk-io/lib/api/schemas/objects";

import { TProfile } from "../Types/Conversation";
import { ConversationMessageType } from "../Types/ConversationMessage";
import ChatUser from "./ChatUser";

const mentionRegex = /\[id(.*?)\|@(.*?)\]/;

abstract class Conversation {
    public message: ConversationMessageType;
    public profile: TProfile;
    public information: MessagesConversation;
    public id: number;
    public type: string;

    public pinned = false;
    public muted = false;
    public mention = false;
    public restricted = false;
    public unread = 0;

    public isUser = false;
    public isGroup = false;
    public isChat = false;

    public users?: ChatUser[];

    public typing: {
        enable: boolean
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        debounce: lodash.DebouncedFunc<any>
    };

    constructor(item: MessagesConversationWithMessage) {
        this.message = item.last_message;
        this.information = item.conversation;
        this.id = item.conversation.peer.id;
        this.type = item.conversation.peer.type;

        this.pinned = item.conversation.sort_id.major_id !== 0;
        this.restricted = !item.conversation.can_write.allowed;
        this.muted = item.muted;
        this.mention = mentionRegex.test(this.message.text);
        this.unread = item.conversation.unread_count || 0;

        this.typing = {
            enable: false,
            debounce: lodash.debounce(function () {
                this.enable = false;
            }, 6000)
        };
    }

    addMessage(message: ConversationMessageType) {
        this.setMessage(message);
        this.stopTyping();

        if (!message.out) {
            this.unread++;
            this.updateMention(message.text);
        }
    }

    setMessage(message: ConversationMessageType): void {
        this.message = message;
        this.setLastMessageId(message.id);
    }

    setLastMessageId(id: number): void {
        this.information.last_message_id = id;
    }

    updateMention(text: string): void {
        this.mention = mentionRegex.test(text);
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
        this.information.in_read = id;
        this.unread = this.information.last_message_id - this.information.in_read;
    }

    readOut(id: number): void {
        this.information.out_read = id;
    }

    updateAvatar(avatar: string): void {
        this.profile.photo_100 = avatar;
    }

    updateTitle(title: string): void {
        this.profile.title = title;
    }

    restrict(restricted = true) {
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