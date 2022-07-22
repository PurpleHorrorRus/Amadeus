<template>
    <div class="attachments-item attachments-item-audio">
        <div class="attachments-item-audio-play" @click.stop="action">
            <PlayIcon v-if="!isPlaying" class="icon attachments-item-audio-play-icon" />
            <PauseIcon v-else class="icon attachments-item-audio-play-icon" />
        </div>

        <div class="attachments-item-audio-information nowrap">
            <span class="attachments-item-audio-information-artist nowrap" v-text="item.artist" />
            <span class="attachments-item-audio-information-title nowrap" v-text="item.title" />
        </div>
    </div>
</template>

<script lang="ts">
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";
import AudioMixin from "~/mixins/audio";

export default {
    components: {
        PlayIcon: () => import("~icons/play.svg"),
        PauseIcon: () => import("~icons/pause.svg")
    },

    mixins: [AttachmentMixin, AudioMixin],

    computed: {
        full_id() {
            return `${this.item.owner_id}_${this.item.id}`;
        },

        isSame() {
            return this.full_id === this.song?.full_id;
        },

        isPlaying() {
            return this.isSame && this.playing;
        }
    },

    methods: {
        action() {
            if (this.isPlaying) {
                return this.pause();
            }

            if (this.isSame) {
                return this.resume();
            }

            return this.play({
                ...this.item,
                full_id: this.full_id
            });
        }
    }
};
</script>

<style lang="scss">
.attachments-item-audio {
    display: grid;
    grid-template-columns: 40px 1fr;
    align-items: center;
    column-gap: 10px;

    &-play {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 40px;
        height: 40px;

        background: var(--secondary);
        border-radius: 100%;

        &-icon {
            width: 20px;

            path {
                stroke: none;
            }
        }
    }

    &-information {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        &-artist {
            font-size: 14px;
        }

        &-title {
            font-size: 12px;
        }
    }
}
</style>