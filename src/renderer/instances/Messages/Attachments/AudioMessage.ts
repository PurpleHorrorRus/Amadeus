import { API, VK } from "vk-io";
import fs from "fs-extra";

import { MessagesAudioMessage } from "vk-io/lib/api/schemas/objects";
import { DocsSaveParams } from "vk-io/lib/api/schemas/params";
import { DocsSaveResponse } from "vk-io/lib/api/schemas/responses";

import Attachment from "../Attachment";

import { IUpload } from "~/instances/Interfaces/Upload";

class AudioMessage extends Attachment implements IUpload {
    public id: number;
    public duration: number;
    public link_ogg: string;
    public waveform: number[];

    public path?: string;
    public temp?: boolean = true;

    constructor(audioMessage: MessagesAudioMessage | DocsSaveResponse, upload?: IUpload) {
        super(audioMessage, "audio_message", upload);

        this.id = audioMessage.id;
        this.duration = audioMessage.duration;
        this.link_ogg = audioMessage.link_ogg;
        this.waveform = audioMessage.waveform;
    }

    async upload(client: VK): Promise<AudioMessage> {
        const server = await this.getServer(client.api);
        const uploaded = await this.uploadOnServer(client.upload, this.path, server, "file");
        const saved = await client.api.docs.save(uploaded as DocsSaveParams);
        fs.removeSync(this.path);
        return new AudioMessage(saved.audio_message);
    }

    protected async getServer(api: API): Promise<string> {
        const server = await api.docs.getMessagesUploadServer({
            type: "audio_message"
        });

        return server.upload_url;
    }
}

export default AudioMessage;