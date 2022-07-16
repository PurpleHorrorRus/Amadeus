import { DocsDoc } from "vk-io/lib/api/schemas/objects";

import Attachment from "../Attachment";

class Doc extends Attachment {
    public owner_id: number;
    public title: string;
    public size: number;
    public ext: string;
    public date: number;
    public doctype: number;
    public url?: string;

    constructor(doc: DocsDoc) {
        super(doc, "doc");
    
        this.owner_id = doc.owner_id;
        this.title = doc.title;
        this.size = doc.size;
        this.ext = doc.ext;
        this.date = doc.date;
        this.doctype = doc.type;
        this.url = doc.url;
    }
}

export default Doc;