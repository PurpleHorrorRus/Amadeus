import { MessagesForeignMessage, MessagesMessage, MessagesMessageAttachment } from "vk-io/lib/api/schemas/objects";
import { TMap } from "../Types/Attachments";
import { TMessage } from "../Types/Messages";

import Attachment from "./Attachment";
import AttachmentGenerator from "./Attachments/Generator";
import Map from "./Attachments/Map";

class Message {
    public id: number;
    public date: number;
    public from_id: number;
    public peer_id: number;
    public text: string;
    public out: boolean;

    public attachments?: Attachment[] | MessagesMessageAttachment[] = [];
    public fwd_messages?: TMessage[] = [];
    public random_id?: number;
    public important?: number | boolean;
    public geo?: TMap;
    private _update_time?: number = 0;
    private _deleted?: boolean = false;
    public selected?: boolean = false;
    public syncing?: boolean | number = 0;

    constructor(message: MessagesMessage | MessagesForeignMessage) {
        this.id = message.id;
        this.date = message.date;
        this.from_id = message.from_id;
        this.peer_id = message.peer_id;
        this.text = message.text;
        this.out = message.out;
        this.random_id = message.random_id;
        this.important = message.important;
        this._update_time = message.update_time || 0;

        if (message.attachments?.length > 0) {
            this.attachments = AttachmentGenerator.generateList(message.attachments);
        }

        if (message.fwd_messages?.length > 0) {
            this.fwd_messages = message.fwd_messages.map(message => {
                return new Message(message);
            });
        }

        if (message.geo) {
            this.geo = new Map(message.geo);
        }
    }

    select(selected: boolean): void {
        this.selected = selected;
    }

    edit(text): void {
        this.text = text;
        this._update_time = Math.floor(Date.now() / 1000);
    }

    delete(): void {
        this._deleted = true;
    }

    restore(): void {
        this._deleted = false;
    }

    get deleted(): boolean {
        return this._deleted;
    }

    get edited(): boolean {
        return Boolean(this._update_time);
    }
}

export default Message;