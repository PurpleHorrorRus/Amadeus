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
        maxSize: ""
    }),

    created() {
        this.maxSize = this.calculateMaxSize(this.item.photo.sizes);
        this.$set(this.item.photo, "maxSize", this.maxSize.url);
    }
};
</script>

<style lang="scss">
.attachments-item-photo {
    width: 100%;

    border-radius: 8px;
}
</style>