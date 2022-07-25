import { VideoVideo1 } from "vk-io/lib/api/schemas/objects";

import { API, VK } from "vk-io";
import { VideoSaveResponse, VideoUploadResponse } from "vk-io/lib/api/schemas/responses";
import Attachment from "../Attachment";
import IPreview from "../../Interfaces/Preview";

import { TSize } from "~/instances/Types/Attachments";
import { IUpload } from "~/instances/Interfaces/Upload";

type TVideo = VideoVideo1 & {
    restriction?: {
        title?: string
    }
}

class Video extends Attachment implements IPreview, IUpload {
    public sizes?: TSize;

    public id: number;
    public owner_id: number;
    public title: string;
    public player?: string = "";
    public restriction?: boolean = false;
    public path?: string;

    constructor(private video: TVideo, upload?: IUpload) {
        super(video, "video", upload);
        this.owner_id = video.owner_id;

        if (video.restriction) {
            this.restriction = true;
            this.title = video.restriction.title;
        } else {
            this.title = video.title;
            this.player = video.player;
            this.sizes = this.calculateSize(this.video.image);
        }
    }

    async upload(client: VK): Promise<Video> {
        const server = await this.getServer(client.api);
        const upload: VideoUploadResponse = await this.uploadOnServer(client.upload, this.path, server, "video_file");

        const response = await client.api.video.get({
            owner_id: upload.owner_id,
            videos: `${upload.owner_id}_${upload.video_id}`
        });

        return new Video(response.items[0]);
    }

    async getServer(api: API): Promise<string> {
        const server: VideoSaveResponse = await api.video.save({
            name: String(Date.now()),
            is_private: 1,
            wallpost: 0
        });

        return server.upload_url;
    }
}

export default Video;