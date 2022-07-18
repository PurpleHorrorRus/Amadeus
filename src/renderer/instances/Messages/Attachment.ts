import {
    AudioAudio,
    BaseSticker,
    DocsDoc,
    MessagesAudioMessage,
    PhotosPhoto,
    PollsPoll,
    StoriesStory,
    VideoVideo,
    WallWallpostFull,
    MessagesGraffiti
} from "vk-io/lib/api/schemas/objects";

import { TLink, TMap, TSize } from "../Types/Attachments";

type TAttachment =
    PhotosPhoto
    | VideoVideo
    | DocsDoc
    | AudioAudio
    | TLink
    | WallWallpostFull
    | StoriesStory
    | MessagesAudioMessage
    | BaseSticker
    | MessagesGraffiti
    | PollsPoll
    | TMap;

type TAttachmentType =
    "photo"
    | "video"
    | "doc"
    | "audio"
    | "wall"
    | "story"
    | "link"
    | "audio_message"
    | "sticker"
    | "poll"
    | "graffiti"
    | "geo"
    | "gift";

abstract class Attachment { 
    public readonly id: number;
    public readonly type: string;
    
    // Uploading properties
    public path?: string;
    public uploading?: boolean;

    constructor(attachment: TAttachment, type: TAttachmentType) {
        this.id = Number(attachment.id);
        this.type = type;
    }

    public calculateSize(images: any[]): TSize {
        const sizes = [...images].sort((a, b) => {
            return (b.width * b.height) - (a.width * a.height);
        });

        return {
            min: sizes[2]?.url || sizes[2]?.src || "",
            medium: sizes[1]?.url || sizes[1]?.src || "",
            max: sizes[0]?.url || sizes[0]?.src || ""
        };
    }
}

export default Attachment;