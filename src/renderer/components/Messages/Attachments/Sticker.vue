<template>
    <div class="attachments-item attachments-item-sticker">
        <lottie-vue-player
            v-if="item.animated"
            :key="settings.appearance.stickersTheme"
            :src="sticker"
            class="attachments-item-sticker-animation"
            autoplay
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
    }
};
</script>

<style lang="scss">
.attachments-item-sticker {
    width: 20vw;
    min-width: 150px;

    &:hover {
        cursor: default;
    }

    &-image, &-animation {
        width: 100%;

        background: none;
    }

    &-animation {
        height: 20%;

        .lf-spinner {
            display: none;
        }
    }
}
</style>