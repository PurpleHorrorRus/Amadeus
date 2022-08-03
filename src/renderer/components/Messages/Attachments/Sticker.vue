<template>
    <div
        class="attachments-item attachments-item-sticker"
        @mouseenter="turnAnimation(true)"
        @mouseleave="turnAnimation(false)"
    >
        <lottie-vue-player
            v-if="item.animated"
            ref="player"
            :src="sticker"
            class="attachments-item-sticker-animated-video"
            loop
        />

        <img
            v-else
            :key="settings.appearance.stickersTheme"
            :src="sticker"
            class="attachments-item-sticker-image"
        >
    </div>
</template>

<script lang="ts">
import CoreMixin from "~/mixins/core";
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    mixins: [CoreMixin, AttachmentMixin],

    computed: {
        sticker() {
            return this.settings.appearance.stickersTheme === 1
                ? this.item.dark
                : this.item.light;
        }
    },

    methods: {
        turnAnimation(sequence) {
            if (!this.item.animated) {
                return false;
            }

            return sequence
                ? this.$refs.player.togglePlayPause()
                : this.$refs.player.stop();
        }
    }
};
</script>

<style lang="scss">
.attachments-item-sticker {
    min-width: 170px;
    max-width: 320px;
    width: 20vw;

    &.clickable {
        cursor: pointer;

        border-radius: 4px;

        &:hover {
            background: var(--secondary-hover);
        }
    }

    &:hover {
        cursor: default;
    }

    &-animated {
        &-video .lf-spinner {
            display: none;
        }
    }

    &-image, &-animated-preview, &-animated-video {
        width: 100%;

        background: none;
    }
}
</style>