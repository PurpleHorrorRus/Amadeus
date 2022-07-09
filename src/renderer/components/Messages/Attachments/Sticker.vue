<template>
    <div class="attachments-item attachments-item-sticker">
        <lottie-vue-player
            v-if="item.sticker.animation_url"
            :key="settings.appearance.stickersTheme"
            :src="item.sticker.animations[settings.appearance.stickersTheme].url"
            class="attachments-item-sticker-animation"
            autoplay
            loop
            mode="normal"
        />

        <img 
            v-else
            :src="sticker" 
            class="attachments-item-sticker-image"
        >
    </div>
</template>

<script>
import CoreMixin from "~/mixins/core";
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    mixins: [CoreMixin, AttachmentMixin],

    computed: {
        sticker() {
            return this.item.sticker.images[this.item.sticker.images.length - 1].url;
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
        height: 20vw;

        .lf-spinner {
            display: none;
        }
    }
}
</style>