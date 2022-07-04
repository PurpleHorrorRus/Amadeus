<template>
    <div class="attachments-item attachments-item-sticker">
        <img :src="sticker" class="attachments-item-sticker-image">
    </div>
</template>

<script>
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    mixins: [AttachmentMixin],

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

    &-image {
        width: 100%;
    }
}
</style>