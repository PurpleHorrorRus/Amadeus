import Attachment from "../Attachment";
import IPreview from "../../Interfaces/Preview";

import { TSize, TLink } from "~/instances/Types/Attachments";

class Link extends Attachment implements IPreview {
    public sizes?: TSize;

    public url: string;
    public title?: string;
    public caption?: string;
    public description?: string;

    constructor(link: TLink) { 
        super(link, "link");
        
        this.url = link.url;
        this.title = link.title;
        this.caption = link.caption;
        this.description = link.description;

        this.sizes = this.calculateSize(link.photo.sizes);
    }
}

export default Link;