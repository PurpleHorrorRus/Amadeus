import { API, VK } from "vk-io";
import { DocsSaveResponse } from "vk-io/lib/api/schemas/responses";
import { DocsDoc } from "vk-io/lib/api/schemas/objects";

import Attachment from "../Attachment";
import AttachmentGenerator from "./Generator";
import { IUpload } from "~/instances/Interfaces/Upload";

class Doc extends Attachment implements IUpload {
    public owner_id: number;
    public title: string;
    public size: number;
    public ext: string;
    public date: number;
    public doctype: number;
    public url?: string;
    public isGif: boolean;

    public path?: string;

    constructor(doc: DocsDoc | DocsSaveResponse, upload?: IUpload) {
        super(doc, "doc", upload);
    
        this.owner_id = doc.owner_id;
        this.title = doc.title;
        this.size = doc.size;
        this.ext = doc.ext;
        this.date = doc.date;
        this.doctype = doc.type;
        this.url = doc.url;

        this.isGif = this.doctype === 3;
    }

    async upload(client: VK): Promise<Attachment> {
        const server = await this.getServer(client.api);
        
        const upload = await this.uploadOnServer(client.upload, this.path, server, "file");
        const saved = await client.api.docs.save({
            file: upload.file
        });

        return AttachmentGenerator.generate(saved);
    }

    protected async getServer(api: API): Promise<string> {
        const server = await api.docs.getUploadServer({});
        return server.upload_url;
    }
}

export default Doc;