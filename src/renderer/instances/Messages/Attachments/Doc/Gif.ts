import { DocsDoc } from "vk-io/lib/api/schemas/objects";

import Doc from "../Doc";
import IPreview from "../../../Interfaces/Preview";

import { TSize } from "~/instances/Types/Attachments";

class DocGif extends Doc implements IPreview {
    public sizes: TSize;

    public playing: boolean = false;
    public added: boolean = false;
    public addedGif?: DocsDoc | null = null;

    constructor(doc: DocsDoc) {
        super(doc);
        this.sizes = this.calculateSize(doc.preview.photo.sizes);
    }

    add(gif: DocsDoc): void {
        this.added = true;
        this.addedGif = gif;
    }

    remove(): void {
        this.added = false;
        this.addedGif = null;
    }

    play(): void {
        this.playing = true;
    }

    stop(): void {
        this.playing = false;
    }
}

export default DocGif;