import Attachment from "../Attachment";

import { TSize } from "~/instances/Types/Attachments";

class MiniApp extends Attachment {
    public id: number;
    public icon: string;
    public banner: TSize;

    public title: string;
    public description: string;
    public shortDescription: string;
    public button: string;

    public url: string;

    constructor(miniapp: any) {
        super(miniapp, "mini_app");

        this.id = miniapp.app.id;
        this.icon = miniapp.app.icon_576;

        this.title = miniapp.title;
        this.description = miniapp.description;
        this.shortDescription = miniapp.app.short_description;
        this.button = miniapp.button_text;

        this.url = miniapp.app.share_url;
        this.banner = this.calculateSize(miniapp.images);
    }
}

export default MiniApp;