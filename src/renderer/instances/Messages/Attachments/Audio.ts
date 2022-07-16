import { AudioAudio } from "vk-io/lib/api/schemas/objects";

import Attachment from "../Attachment";

class Audio extends Attachment implements AudioAudio {
    public owner_id: number;
    public id: number;
    public artist: string;
    public title: string;
    public duration: number;
    public url?: string;

    constructor(audio: AudioAudio) { 
        super(audio, "audio");

        this.owner_id = audio.owner_id;
        this.id = audio.id;
        this.artist = audio.artist;
        this.title = audio.title;
        this.duration = audio.duration;
        this.url = audio.url;
    }
}

export default Audio;