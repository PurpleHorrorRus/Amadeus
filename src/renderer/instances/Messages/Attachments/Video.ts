import { VideoVideo1 } from "vk-io/lib/api/schemas/objects";

import Attachment from "../Attachment";
import IPreview from "../../Interfaces/Preview";

import { TSize } from "~/instances/Types/Attachments";
import { IUpload } from "~/instances/Interfaces/Upload";

class Video extends Attachment implements IPreview, IUpload {
    public sizes?: TSize;

    public id: number;
    public title: string;
    public player?: string = "";
    public restriction?: boolean = false;

    constructor(private video: VideoVideo1, upload?: IUpload) { 
        super(video, "video");

        this.title = video.title;
        
        !video.content_restricted
            ? this.player = video.player
            : this.restriction = true;

        this.sizes = this.calculateSize(this.video.image);

        if (upload) {
            this.path = upload.path;
            this.upload_field = "video_file";
            this.upload_type = "video/mp4";
        }
    }
}

export default Video;