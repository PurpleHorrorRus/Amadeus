import { MessagesForeignMessage, MessagesMessage, MessagesMessageAttachment } from "vk-io/lib/api/schemas/objects";
import { TMap } from "../Types/Attachments";
import { TProfile } from "../Types/Conversation";
import { TMessage } from "../Types/Messages";

import Attachment from "./Attachment";
import AttachmentGenerator from "./Attachments/Generator";
import Map from "./Attachments/Map";

class Message implements TMessage {
    public id: number;
    public readonly date: number;
    public readonly from_id: number;
    public readonly peer_id: number;
    public readonly out: boolean;
    public text: string;

    public attachments?: Attachment[] | MessagesMessageAttachment[] = [];
    public fwd_messages?: any[] = [];
    public profile?: TProfile;
    public reply_message?: TMessage;
    public action?: any;
    public random_id?: number;
    public important?: number | boolean;
    public geo?: TMap;
    public update_time?: number = 0;
    public deleted?: boolean = false;
    public selected?: boolean = false;
    public syncing?: boolean | number = 0;

    constructor(message: MessagesMessage | MessagesForeignMessage, profile?: TProfile) {
        this.id = message.id;
        this.date = message.date;
        this.from_id = message.from_id;
        this.peer_id = message.peer_id;
        this.text = message.text;
        this.out = message.out;
        this.random_id = message.random_id;
        this.important = message.important;
        this.syncing = message.syncing;
        this.update_time = message.update_time || 0;

        if (profile) {
            this.profile = profile;
        }

        if (message.attachments?.length > 0) {
            this.attachments = AttachmentGenerator.generateList(message.attachments);
        }

        if (message.reply_message) {
            this.reply_message = new Message(message.reply_message);
        }

        if (message.fwd_messages) {
            this.fwd_messages = message.fwd_messages;
        }

        if (message.action) {
            this.action = message.action;
        }

        if (message.geo) {
            this.geo = new Map(message.geo);
        }
    }

    select(selected: boolean): void {
        this.selected = selected;
    }

    edit(text: string, attachments: Attachment[] = []): void {
        this.text = text;
        this.attachments = attachments;
        this.update_time = Math.floor(Date.now() / 1000);
    }

    delete(): void {
        this.deleted = true;
    }

    restore(): void {
        this.deleted = false;
    }

    get edited(): boolean {
        return Boolean(this.update_time);
    }
}

export default Message;