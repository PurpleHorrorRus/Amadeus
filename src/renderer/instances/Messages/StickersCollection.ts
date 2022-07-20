import Sticker from "./Attachments/Sticker";

class StickersCollection {
    public id: number;
    public title: string;
    public preview: string;
    public stickers: Sticker[];
    public purchase_date: number;

    constructor(collection) {
        this.id = collection.id;
        this.title = collection.title;
        this.purchase_date = collection.purchase_date;
        this.preview = (collection.preview ?? collection.previews[collection.previews.length - 1]?.url)
            || "";

        this.stickers = collection.stickers.map(sticker => {
            return new Sticker(sticker);
        });
    }
}

export default StickersCollection;