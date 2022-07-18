import { PhotosPhoto } from "vk-io/lib/api/schemas/objects";

import Attachment from "../Attachment";
import IPreview from "../../Interfaces/Preview";

import { TSize } from "~/instances/Types/Attachments";
import { IUpload } from "~/instances/Interfaces/Upload";

class Photo extends Attachment implements IPreview, IUpload {
    public sizes: TSize;
    public path?: string;

    constructor(private photo: PhotosPhoto, upload?: IUpload) { 
        super(photo, "photo");
        this.sizes = this.calculateSize(this.photo.sizes);
        
        if (upload) {
            this.path = upload.path;
        }
    }

    get preview(): string {
        return this.sizes.max
            || this.sizes.medium
            || this.sizes.min;
    }
}

export default Photo;