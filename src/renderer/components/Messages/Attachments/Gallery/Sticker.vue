<template>
    <div class="attachments-item attachments-item-sticker">
        <img :src="sticker" class="attachments-item-sticker-image">
    </div>
</template>

<script>
import GalleryMixin from "~/components/Messages/Attachments/Gallery/Gallery";

export default {
    mixins: [GalleryMixin],

    computed: {
        sticker() {
            return this.item.sticker.images[this.item.sticker.images.length - 1].url;
        }
    },

    mounted() {
        console.log(this.item);
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