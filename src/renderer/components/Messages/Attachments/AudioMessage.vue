<template>
    <div class="attachments-item attachments-item-audiomessage">
        <div class="attachments-item-audiomessage-play" @click.stop="action">
            <PlayIcon v-if="!isPlaying" class="icon vkgram" />
            <PauseIcon v-else class="icon vkgram" />
        </div>

        <div 
            ref="waveform" 
            class="attachments-item-audiomessage-waveform"
            @click.stop="seekTo"
        >
            <div 
                v-for="(peak, index) of waveform"
                :key="index"
                class="attachments-item-audiomessage-waveform-peak"
                :class="{ played: index <= playedIndex || !isSame }"
                :style="peakStyle(peak)"
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        PlayIcon: () => import("~/assets/icons/play.svg"),
        PauseIcon: () => import("~/assets/icons/pause.svg")
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
            return this.voice?.id === this.item.audio_message.id;
        },

        isPlaying() {
            return this.playing && this.isSame;
        },

        playedIndex() {
            return Math.floor(this.time / this.percentPerPeak);
        }
    },

    created() {
        this.percent = this.item.audio_message.duration / 100;
        this.percentPerPeak = this.item.audio_message.duration / this.item.audio_message.waveform.length;

        this.waveform = this.item.audio_message.waveform.length > 0
            ? this.item.audio_message.waveform
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
            seek: "audio_message/SEEK",
            clear: "audio_message/CLEAR"
        }),

        action() {
            if (!this.isSame) { 
                return this.play(this.item.audio_message);
            }

            return this.playing
                ? this.pause()
                : this.resume();
        },

        seekTo(event) {
            if (!this.isSame) {
                return false;
            }

            const percent = (event.offsetX / this.$refs.waveform.clientWidth) * 100;
            const time = this.percent * percent;
            return this.seek(time);
        },

        peakStyle(peak) {
            return { 
                height: Math.floor(Math.max(peak, 2) / 1.1) + "px"
            };
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

        background: var(--contrast);
        border-radius: 100%;

        cursor: pointer;

        .icon {
            width: 16px;
        }
    }

    &-waveform {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: nowrap;
        column-gap: 1px;

        width: 95%;

        &-peak {
            width: 1px;

            background: var(--player-slider);
            pointer-events: none;

            &.played {
                background: var(--contrast);
            }
        }
    }
}
</style>