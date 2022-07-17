import { MessagesMessage } from "vk-io/lib/api/schemas/objects";
import { TProfile } from "../Types/Conversation";
import Message from "./Message";

class ImportantMessage extends Message {
    public id: number;
    public profile: TProfile;

    constructor(message: MessagesMessage, profile: TProfile) {
        super(message);
        this.profile = profile;
    }
}

export default ImportantMessage;