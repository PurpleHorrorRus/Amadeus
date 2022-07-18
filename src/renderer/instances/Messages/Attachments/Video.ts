import { VideoVideo1 } from "vk-io/lib/api/schemas/objects";

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
    public title: string;
    public player?: string = "";
    public restriction?: boolean = false;

    constructor(private video: TVideo, upload?: IUpload) { 
        super(video, "video");

        if (video.restriction) {
            this.restriction = true;
            this.title = video.restriction.title;
        } else {
            this.title = video.title;
            this.player = video.player;
            this.sizes = this.calculateSize(this.video.image);
        }

        if (upload) {
            this.path = upload.path;
            this.upload_field = "video_file";
            this.upload_type = "video/mp4";
        }
    }
}

export default Video;