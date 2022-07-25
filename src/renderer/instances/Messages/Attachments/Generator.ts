import { MessagesMessageAttachment } from "vk-io/lib/api/schemas/objects";

import Attachment from "../Attachment";
import Photo from "./Photo";
import Video from "./Video";
import Audio from "./Audio";
import Doc from "./Doc";
import DocGif from "./Doc/Gif";
import Wall from "./Wall";
import AudioMessage from "./AudioMessage";
import Link from "./Link";
import Sticker from "./Sticker";
import Story from "./Story";
import Poll from "./Poll";
import Graffiti from "./Graffiti";
import AudioPlaylist from "./AudioPlaylist";
import Gift from "./Gift";

class AttachmentGenerator {
    static generateList(list: MessagesMessageAttachment[]): Attachment[] | MessagesMessageAttachment[] {
        return list.map(AttachmentGenerator.generate);
    }

    static generate(attachment: MessagesMessageAttachment): Attachment | MessagesMessageAttachment {
        switch (attachment.type) {
            case "photo": return new Photo(attachment.photo, {
                path: attachment.path,
                temp: attachment.temp
            });

            case "video": return new Video(attachment.video);
            case "audio": return new Audio(attachment.audio);
            case "audio_playlist": return new AudioPlaylist(attachment.audio_playlist);

            case "doc": {
                if (attachment instanceof Doc || attachment instanceof DocGif) {
                    return attachment as Attachment;
                }

                return attachment.doc.type === 3
                    ? new DocGif(attachment.doc)
                    : new Doc(attachment.doc);
            }

            case "wall": return new Wall(attachment.wall);

            case "audio_message": {
                if (attachment instanceof AudioMessage) {
                    return attachment as Attachment;
                }

                return new AudioMessage(attachment.audio_message);
            }

            case "link": return new Link(attachment.link);

            case "sticker": {
                if (attachment instanceof Sticker) {
                    return attachment as Sticker;
                }

                return new Sticker(attachment.sticker);
            }

            case "story": return new Story(attachment.story);
            case "poll": return new Poll(attachment.poll);
            case "graffiti": return new Graffiti(attachment.graffiti);
            case "gift": return new Gift(attachment.gift);
        }

        return attachment;
    }
}

export default AttachmentGenerator;