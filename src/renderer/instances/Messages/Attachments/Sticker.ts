import { BaseSticker, BaseStickerAnimation } from "vk-io/lib/api/schemas/objects";

import Attachment from "../Attachment";
import IPreview from "../../Interfaces/Preview";

import { TSize } from "~/instances/Types/Attachments";

class Sticker extends Attachment implements BaseSticker, IPreview {
    public sticker_id?: number;
    public type: string;

    public sizes?: TSize;
    public sizesBackground: TSize;

    public animated?: boolean = false;
    public animations?: BaseStickerAnimation[];

    constructor(sticker: BaseSticker) { 
        super({
            ...sticker,
            id: sticker.sticker_id
        }, "sticker");

        this.sticker_id = sticker.sticker_id;

        this.animated = "animations" in sticker;

        if (this.animated) {
            this.animations = sticker.animations;
        }
  
        this.sizes = this.calculateSize(sticker.images);
        this.sizesBackground = this.calculateSize(sticker.images_with_background);
    }

    get light() {
        return this.animated
            ? this.animations[0].url
            : this.sizesBackground.max;
    }

    get dark() {
        return this.animated
            ? this.animations[1].url
            : this.sizes.max;
    }
}

export default Sticker;