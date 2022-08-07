import { WallWallpostFull, MessagesMessageAttachment } from "vk-io/lib/api/schemas/objects";

import Attachment from "../Attachment";
import AttachmentGenerator from "./Generator";

class Wall extends Attachment implements WallWallpostFull {
    public id: number;
    public owner_id: number;
    public post_id?: number;
    public from_id?: number;

    public text?: string;
    public date?: number;
    public attachments?: Attachment[] | MessagesMessageAttachment[] = [];
    public copy_history?: WallWallpostFull[] = [];

    constructor(wall: WallWallpostFull) {
        super(wall, "wall");

        this.id = wall.id;

        this.owner_id = wall.owner_id || wall.from_id;
        this.post_id = wall.post_id || wall.id;
        this.from_id = wall.from_id;
        this.text = wall.text;
        this.date = wall.date;

        if (wall.attachments?.length > 0) {
            this.attachments = AttachmentGenerator.generateList(wall.attachments);
        }

        if (wall.copy_history?.length > 0) {
            this.copy_history = wall.copy_history;
        }
    }

    static format(wall: WallWallpostFull) {
        if (wall.copy_history?.length > 0) {
            wall.attachments = [Wall.format(wall.copy_history[0])];
            delete wall.copy_history;
        }

        return new Wall(wall);
    }
}

export default Wall;