import { FormData } from "formdata-node";
import { fileFromPathSync } from "formdata-node/file-from-path";
import { API, Upload, VK } from "vk-io";

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
    MessagesGraffiti,
    BaseImage
} from "vk-io/lib/api/schemas/objects";
import { PhotosSaveMessagesPhotoParams, VideoSaveParams } from "vk-io/lib/api/schemas/params";
import { DocsDocUploadResponse } from "vk-io/lib/api/schemas/responses";
import { IUpload } from "../Interfaces/Upload";

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
    | TMap

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

type TUpload =
    PhotosSaveMessagesPhotoParams
    | VideoSaveParams
    | DocsDocUploadResponse;

abstract class Attachment implements IUpload { 
    public readonly id: number;
    public readonly owner_id: number;
    public readonly type: string;
    
    // Uploading properties
    public path?: string;
    public temp?: boolean;

    constructor(attachment: TAttachment, type: TAttachmentType, upload?: IUpload) {
        this.id = Number(attachment.id);
        this.owner_id = attachment.owner_id;
        this.type = type;

        if (upload) {
            this.path = upload.path;
            this.temp = upload.temp || false;
        }
    }

    public calculateSize(images?: BaseImage[]): TSize {
        if (!images) {
            return {
                max: "",
                medium: "",
                min: ""
            };
        }

        const sizes = [...images].sort((a, b) => {
            return (b.width * b.height) - (a.width * a.height);
        });

        return {
            min: sizes[2]?.url || sizes[2]?.src || "",
            medium: sizes[1]?.url || sizes[1]?.src || "",
            max: sizes[0]?.url || sizes[0]?.src || ""
        };
    }

    async upload(_client: VK): Promise<any> { 
        return new Promise(resolve => {
            return resolve("Unknown upload");
        });
    }

    protected getServer(_api: API): Promise<string> {
        return new Promise(resolve => {
            return resolve("Unknown getServer");
        });
    }

    protected async uploadOnServer(
        uploader: Upload,
        file: string,
        server: string,
        field: string = "file"
    ): Promise<TUpload> { 
        return await uploader.upload(server, {
            // @ts-ignore
            formData: this.prepareFormdata(file, field),
            timeout: 0,
            forceBuffer: true
        });
    }

    private prepareFormdata(file: string, field = "file"): FormData {
        const form = new FormData();
        form.set(field, fileFromPathSync(file));
        return form;
    }
}

export default Attachment;