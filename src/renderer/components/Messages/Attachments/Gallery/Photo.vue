<template>
    <img
        :src="item.preview"
        class="attachments-item attachments-item-photo"
        :style="itemStyle"
    >
</template>

<script lang="ts">
import GalleryMixin from "~/components/Messages/Attachments/Gallery/Gallery";

export default {
    mixins: [GalleryMixin]
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