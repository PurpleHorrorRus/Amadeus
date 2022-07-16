import { PhotosPhoto } from "vk-io/lib/api/schemas/objects";

import Attachment from "../Attachment";
import IPreview from "../../Interfaces/Preview";

import { TSize } from "~/instances/Types/Attachments";

class Photo extends Attachment implements IPreview {
    public sizes: TSize;

    constructor(private photo: PhotosPhoto) { 
        super(photo, "photo");
        this.sizes = this.calculateSize(this.photo.sizes);
    }
}

export default Photo;