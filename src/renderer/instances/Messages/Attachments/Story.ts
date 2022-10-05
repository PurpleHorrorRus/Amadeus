import DateDiff from "date-diff";

import Attachment from "../Attachment";
import IPreview from "~/instances/Interfaces/Preview";
import { TSize, TStory } from "~/instances/Types/Attachments";

class Story extends Attachment implements IPreview {
    public sizes?: TSize;

    public id: number;
    public src?: string = "";
    private _date?: number;
    private _is_expired?: number | boolean;
    private _is_deleted?: number | boolean;

    constructor(story: TStory) {
        super(story, "story");

        this.id = story.id;
        this._date = story.date;
        this._is_expired = story.is_expired;
        this._is_deleted = story.is_deleted;

        if (!this.restriction) {
            if (story.video) {
                const links = Object.values(story.video.files);
                this.src = links[links.length - 1];
            }

            const preview = story.video?.files || story.photo.sizes;
            this.sizes = this.calculateSize(preview);
        }
    }

    get restriction(): boolean {
        if (this._is_expired || this._is_deleted) {
            return true;
        }

        const diff = new DateDiff(new Date(), new Date(this._date * 1000));
        return Math.floor(diff.hours()) >= 24;
    }
}

export default Story;