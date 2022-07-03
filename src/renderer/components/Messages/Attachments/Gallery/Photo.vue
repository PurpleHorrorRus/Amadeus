<template>
    <img 
        :src="maxSize" 
        class="gallery-item gallery-item-photo"
        :style="itemStyle"
        @click="open"
    >
</template>

<script>
import GalleryMixin from "~/components/Messages/Attachments/Gallery/Gallery";

export default {
    mixins: [GalleryMixin],

    data: () => ({
        maxSize: ""
    }),

    created() {
        this.maxSize = this.calculateMaxSize(this.item.photo.sizes);
        this.$set(this.item.photo, "maxSize", this.maxSize);
    }
};
</script>

<style lang="scss">
.gallery-item-photo {
    width: 100%;
    height: auto;

    border-radius: 8px;
}
</style>