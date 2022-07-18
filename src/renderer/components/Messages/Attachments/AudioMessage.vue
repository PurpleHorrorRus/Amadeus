<template>
    <div class="attachments-item attachments-item-audiomessage" @click.stop="action">
        <div class="attachments-item-audiomessage-play">
            <PlayIcon v-if="!isPlaying" class="icon vkgram" />
            <PauseIcon v-else class="icon vkgram" />
        </div>

        <Waveform :waveform="waveform" />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        Waveform: () => import("~/components/Messages/Attachments/AudioMessage/Waveform"),
        PlayIcon: () => import("~icons/play.svg"),
        PauseIcon: () => import("~icons/pause.svg")
    },

    mixins: [AttachmentMixin],

    data: () => ({
        waveform: [],
        percent: 0,
        percentPerPeak: 0
    }),

    computed: {
        ...mapState({
            voice: state => state.audio_message.voice,
            playing: state => state.audio_message.playing,
            time: state => state.audio_message.time
        }),

        isSame() {
            return this.voice?.id === this.item.id;
        },

        isPlaying() {
            return this.playing && this.isSame;
        },

        playedIndex() {
            return Math.floor(this.time / this.percentPerPeak);
        }
    },

    created() {
        this.percent = this.item.duration / 100;
        this.percentPerPeak = this.item.duration / this.item.waveform.length;

        this.waveform = this.item.waveform.length > 0
            ? this.item.waveform
            : new Array(128).fill(2);
    },

    beforeDestroy() {
        this.clear();
    },

    methods: {
        ...mapActions({
            play: "audio_message/PLAY",
            pause: "audio_message/PAUSE",
            resume: "audio_message/RESUME",
            clear: "audio_message/CLEAR"
        }),

        action() {
            if (!this.isSame) { 
                return this.play(this.item);
            }

            return this.playing
                ? this.pause()
                : this.resume();
        }
    }
};
</script>

<style lang="scss">
.attachments-item-audiomessage {
    display: grid;
    grid-template-columns: 30px 1fr;
    justify-content: center;
    align-items: center;
    column-gap: 10px;

    &-play {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 30px;
        height: 30px;

        background: var(--secondary);
        border-radius: 100%;

        cursor: pointer;

        .icon {
            width: 16px;
        }
    }
}
</style>