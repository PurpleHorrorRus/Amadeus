<template>
    <div class="attachments-item-doc-gif-preview">
        <span
            class="attachments-item-doc-gif-preview-size"
            v-text="size"
        />

        <nuxt-img
            :src="item.preview"
            class="attachments-item-doc-gif-preview-image"
        />
    </div>
</template>

<script lang="ts">
import DocMixin from "~/components/Messages/Attachments/Doc/Mixin";

export default {
    mixins: [DocMixin]
};
</script>

<style lang="scss">
.attachments-item-doc-gif-preview {
    position: relative;

    width: 100%;
    height: 100%;

    &-image {
        width: 100%;
        height: 100%;

        border-radius: 8px;

        object-fit: cover;
    }

    &-size {
        position: absolute;
        top: 5px; left: 5px;

        display: flex;
        justify-content: center;
        align-items: center;

        padding: 5px;

        background-color: #00000080;
        border-radius: 4px;

        font-size: 11px;
    }
}
</style>