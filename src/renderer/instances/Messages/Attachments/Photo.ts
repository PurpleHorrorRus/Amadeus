import { API, VK } from "vk-io";
import fs from "fs-extra";

import { PhotosPhoto } from "vk-io/lib/api/schemas/objects";
import { PhotosSaveMessagesPhotoParams } from "vk-io/lib/api/schemas/params";
import { PhotosGetMessagesUploadServerResponse } from "vk-io/lib/api/schemas/responses";

import Attachment from "../Attachment";
import IPreview from "../../Interfaces/Preview";

import { TSize } from "~/instances/Types/Attachments";
import { IUpload } from "~/instances/Interfaces/Upload";

class Photo extends Attachment implements IPreview, IUpload {
    public sizes?: TSize;
    public path?: string;
    public temp?: boolean;

    constructor(private photo: PhotosPhoto, upload?: IUpload) { 
        super(photo, "photo", upload);
        this.sizes = this.calculateSize(this.photo.sizes);
    }

    get preview(): string {
        return this.sizes.max
            || this.sizes.medium
            || this.sizes.min;
    }

    async upload(client: VK): Promise<Photo> { 
        const url = await this.getServer(client.api);
        const uploaded = await this.uploadOnServer(client.upload, this.path, url, "photo");
        const [saved] = await client.api.photos.saveMessagesPhoto(uploaded as PhotosSaveMessagesPhotoParams);

        if (this.temp) {
            fs.removeSync(this.path);
        }

        return new Photo(saved);
    }

    async getServer(api: API): Promise<string> { 
        const server: PhotosGetMessagesUploadServerResponse = await api.photos.getMessagesUploadServer({});
        return server.upload_url;
    }
}

export default Photo;