import { GiftsLayout } from "vk-io/lib/api/schemas/objects";
import Attachment from "../Attachment";

class Gift extends Attachment { 
    private _id: number;
    public image?: string;

    constructor(gift: GiftsLayout) {
        super(gift, "gift");

        this._id = gift.id;
        this.image = gift.thumb_256 || gift.thumb_96 || gift.thumb_48;
    }
}

export default Gift;