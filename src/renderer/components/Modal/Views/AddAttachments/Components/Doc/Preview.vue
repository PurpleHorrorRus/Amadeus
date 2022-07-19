<template>
    <div class="inline-doc-preview">
        <InlineDocPreviewGif v-if="item.isGif" :item="item" />
        <InlineDocPreviewDoc v-else />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        InlineDocPreviewGif: () => import("./Preview/Gif.vue"),
        InlineDocPreviewDoc: () => import("./Preview/Doc.vue")
    },

    props: {
        item: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
.inline-doc-preview {
    width: 40px;
    height: 40px;

    > div, > div img {
        border-radius: 4px;
    }
}
</style>