import { MessagesMessageAttachment } from "vk-io/lib/api/schemas/objects";

import Attachment from "../Attachment";
import Photo from "./Photo";
import Video from "./Video";
import Audio from "./Audio";
import Doc from "./Doc";
import DocGif from "./Doc/Gif";
import AudioMessage from "./AudioMessage";
import Link from "./Link";
import Sticker from "./Sticker";
import Story from "./Story";
import Poll from "./Poll";
import Graffiti from "./Graffiti";
import AudioPlaylist from "./AudioPlaylist";
import Gift from "./Gift";
import Wall from "./Wall";

class AttachmentGenerator {
    static generateList(list: MessagesMessageAttachment[]): Attachment[] {
        return list.map(AttachmentGenerator.generate);
    }

    static generate(attachment: MessagesMessageAttachment): Attachment {
        if (attachment instanceof Attachment) {
            return attachment;
        }

        switch (attachment.type) {
            case "photo": return new Photo(attachment.photo, {
                path: attachment.path,
                temp: attachment.temp
            });

            case "video": return new Video(attachment.video);
            case "audio": return new Audio(attachment.audio);
            case "audio_playlist": return new AudioPlaylist(attachment.audio_playlist);

            case "doc": {
                return attachment.doc.type === 3
                    ? new DocGif(attachment.doc)
                    : new Doc(attachment.doc);
            }

            case "audio_message": return new AudioMessage(attachment.audio_message);
            case "link": return new Link(attachment.link);
            case "sticker": return new Sticker(attachment.sticker);
            case "story": return new Story(attachment.story);
            case "poll": return new Poll(attachment.poll);
            case "graffiti": return new Graffiti(attachment.graffiti);
            case "gift": return new Gift(attachment.gift);

            case "wall": return Wall.format(attachment.wall);
        }
    }
}

export default AttachmentGenerator;