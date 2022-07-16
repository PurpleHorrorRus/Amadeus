import { MessagesAudioMessage } from "vk-io/lib/api/schemas/objects";

import Attachment from "../Attachment";

class AudioMessage extends Attachment {
    public id: number;
    public duration: number;
    public link_ogg: string;
    public waveform: number[];
    
    private _owner_id: number;

    constructor(audioMessage: MessagesAudioMessage) {
        super(audioMessage, "audio_message");

        this.id = audioMessage.id;
        this.duration = audioMessage.duration;
        this.link_ogg = audioMessage.link_ogg;
        this.waveform = audioMessage.waveform;

        this._owner_id = audioMessage.owner_id;
    }
}

export default AudioMessage;