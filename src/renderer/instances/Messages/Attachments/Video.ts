import { VideoVideo1 } from "vk-io/lib/api/schemas/objects";

import Attachment from "../Attachment";
import IPreview from "../../Interfaces/Preview";

import { TSize } from "~/instances/Types/Attachments";

class Video extends Attachment implements IPreview {
    public sizes: TSize;

    public id: number;
    public title: string;
    public player?: string = "";
    public restriction?: boolean = false;

    constructor(private video: VideoVideo1) { 
        super(video, "video");

        this.title = video.title;
        
        !video.content_restricted
            ? this.player = video.player
            : this.restriction = true;

        this.sizes = this.calculateSize(this.video.image);
    }
}

export default Video;