<template>
    <div id="recorder" :class="recorderClass">
        <MicIcon 
            v-tooltip.top-start="recordText"
            class="icon vkgram clickable mic" 
            @click="turnRecord"
        />

        <StopIcon
            v-if="recording"
            v-tooltip.top-start="'Прервать запись'"
            class="icon vkgram clickable"
            @click="reset"
        />
    </div>
</template>

<script lang="ts">
/// <reference types="dom-mediacapture-record" />
import path from "path";
import { Readable } from "stream";
import { mapActions } from "vuex";
import fs from "fs-extra";

import CoreMixin from "~/mixins/core";

const extension: string = ".ogg";

const params: MediaTrackConstraints = {
    channelCount: 1,
    sampleRate: 16000,
    sampleSize: 16
};

const recorderParams: MediaRecorderOptions = {
    audioBitsPerSecond: 16000
};

const BlobParams: BlobPropertyBag = {
    type: "audio/ogg; codecs=opus"
};

const limitation = 1000 * 5;

export default {
    components: {
        MicIcon: () => import("~icons/mic.svg"),
        StopIcon: () => import("~icons/stop.svg")
    },

    mixins: [CoreMixin],

    data: () => ({
        recording: false as boolean,
        stream: null as MediaStream,
        recorder: null,
        file: "" as string,
        interrupt: false as boolean,

        interval: null as number,
        duration: 0 as number
    }),

    computed: {
        recorderClass() {
            return {
                recording: this.recording
            };
        },

        recordText() {
            return !this.recording
                ? "Записать голосовое сообщение"
                : "Отправить голосовое сообщение";
        }
    },

    beforeDestroy() {
        if (this.recording) {
            this.reset();
        }
    },

    methods: {
        ...mapActions({
            uploadAudioMessage: "vk/uploader/UPLOAD_AUDIO_MESSAGE",
            send: "vk/messages/SEND"
        }),

        turnRecord() {
            return !this.recording
                ? this.startRecord()
                : this.stopRecord();
        },

        async startRecord() {
            this.interrupt = false;

            const filename = String(Date.now()) + extension;
            this.file = path.resolve(this.paths.temp, filename);

            this.stream = await this.initDevice();
            this.recorder = this.initRecorder(this.stream);
            this.recorder.start();
            this.recording = true;

            this.duration = 1;
            this.interval = setInterval(() => {
                this.duration++;

                if (this.duration === limitation) {
                    this.stopRecord();
                }
            }, 1000);
        },

        async stopRecord() {
            this.recorder.stop();
            this.stream.getTracks()[0].stop();
            this.stream = null;
            this.recording = false;

            clearInterval(this.interval);
            this.interval = null;
            this.duration = 0;
            
            if (this.interrupt) {
                return false;
            }

            const upload = await this.uploadAudioMessage(this.file);
            this.file = "";

            return this.send({
                attachments: [upload],
                peer_id: this.current.id
            });
        },

        async initDevice() {
            return await navigator.mediaDevices.getUserMedia({
                video: false,
                
                audio: {
                    deviceId: this.settings.inputDevice,
                    ...params
                }
            });
        },
        
        initRecorder(stream) {
            const chunks: Blob[] = [];
            const recorder = new MediaRecorder(stream, recorderParams);
            
            recorder.ondataavailable = event => {
                chunks.push(event.data);
            };

            recorder.onstop = async () => {
                if (this.interrupt) {
                    return false;
                }

                const writeStream = fs.createWriteStream(this.file);
                const blob = new Blob(chunks, BlobParams);
                const arrayBuffer = await blob.arrayBuffer();
                const array = new Uint8Array(arrayBuffer);
                const buffer = Buffer.from(array);
                const readStream = this.bufferToStream(buffer);
                readStream.pipe(writeStream);
            };

            return recorder;
        },

        bufferToStream(buffer) {
            const stream = new Readable();
            stream.push(buffer);
            stream.push(null);
            return stream;
        },

        reset() {
            this.interrupt = true;
            this.stopRecord();
        }
    }
};
</script>

<style lang="scss">
#recorder {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;

    &.recording {
        .mic path {
            fill: #ff0000;
        }
    }

    .icon {
        width: 24px;
    }
}
</style>