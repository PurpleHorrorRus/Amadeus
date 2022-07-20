import Attachment from "../Attachment";
import { TAudioPlaylist } from "~/instances/Types/Attachments";

class AudioPlaylist extends Attachment {
    private access_hash?: string;
    public count: number;
    public description: string;
    public id: number;
    public owner_id: number;
    public title: string;
    public listens?: number = 0;
    public followers?: number = 0;
    public cover?: string = "";

    constructor(playlist: TAudioPlaylist) {
        super(playlist, "audio_playlist");

        this.access_hash = playlist.access_key;
        this.description = playlist.description;
        this.id = playlist.id;
        this.owner_id = playlist.owner_id;
        this.title = playlist.title;
        this.listens = playlist.plays;
        this.followers = playlist.followers;
        this.cover = playlist.photo?.photo_300 || "./no-cover.png";
    }

    get link() {
        return `https://vk.com/music/playlist/${this.owner_id}_${this.id}_${this.access_hash}`;
    }

    get meridius() {
        return `/playlist/${this.owner_id}/${this.id}?access_hash=${this.access_hash}`;
    }
}

export default AudioPlaylist;