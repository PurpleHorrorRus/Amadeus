<template>
    <img 
        :src="maxSize.url" 
        class="attachments-item attachments-item-photo"
        :style="itemStyle"
        @click.stop="openMedia($parent.data, index)"
    >
</template>

<script>
import GalleryMixin from "~/components/Messages/Attachments/Gallery/Gallery";

export default {
    mixins: [GalleryMixin],

    data: () => ({
        maxSize: { url: "" }
    }),

    created() {
        this.maxSize = this.calculateMaxSize(this.item.photo.sizes);
    }
};
</script>

<style lang="scss">
.attachments-item-photo {
    width: 100%;
    height: 100%;

    border-radius: 8px;
    object-fit: cover;
}
</style>