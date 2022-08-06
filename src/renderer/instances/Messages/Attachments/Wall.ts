import { WallWallpostFull, MessagesMessageAttachment } from "vk-io/lib/api/schemas/objects";

import { MessagesGetHistoryResponse } from "vk-io/lib/api/schemas/responses";
import Attachment from "../Attachment";
import AttachmentGenerator from "./Generator";
import { TProfile } from "~/instances/Types/Conversation";
import ProfileGenerator from "~/instances/Generator";

class Wall extends Attachment implements WallWallpostFull {
    public id: number;
    public profile: TProfile;
    public owner_id: number;
    public post_id?: number;
    public from_id?: number;

    public text?: string;
    public date?: number;
    public attachments?: Attachment[] | MessagesMessageAttachment[] = [];
    public copy_history?: WallWallpostFull[] = [];

    constructor(wall: WallWallpostFull, profile: TProfile) {
        super(wall, "wall");

        this.id = wall.id;
        this.profile = profile;

        this.owner_id = wall.owner_id;
        this.post_id = wall.post_id;
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

    static format(wall: WallWallpostFull, history: MessagesGetHistoryResponse) {
        const profile: TProfile = ProfileGenerator.generate(wall.from_id, history.profiles, history.groups);

        if (wall.copy_history?.length > 0) {
            return new Wall(wall.copy_history[0], profile);
        }

        return new Wall(wall, profile);
    }
}

export default Wall;