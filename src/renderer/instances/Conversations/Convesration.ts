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
    }

    setMessage(message: ConversationMessageType) {
        this.message = message;
        this.information.last_message_id = message.id;
    }

    updateMention(text: string): void {
        this.mention = mentionRegex.test(text);
    }

    setOnline(online, platform): void {
        this.profile.online = online;
        this.profile.online_mobile = Number(online && platform < 6);

        if (!this.profile.online) {
            this.profile.last_seen.time = Math.floor(Date.now() / 1000);
            this.profile.last_seen.platform = platform;
        }
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

    get unread(): number {
        return !this.message.out
            ? this.information.last_message_id - this.information.in_read
            : 0;
    }

    get isTyping(): boolean {
        return (this.isUser || this.isGroup)
            && this.typing.enable;
    }
}

export default Conversation;