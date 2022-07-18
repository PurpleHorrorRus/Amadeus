import { TSize } from "~/instances/Types/Attachments";

interface IPreview {
    sizes?: TSize;
    calculateSize(images: any[]): TSize
    readonly preview?: string
}

export default IPreview;