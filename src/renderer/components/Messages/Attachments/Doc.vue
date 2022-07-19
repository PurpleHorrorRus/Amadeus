<template>
    <div class="attachments-item attachments-item-doc">
        <DocGif v-if="item.isGif" :item="item" />
        <InlineDoc v-else :item="item" />
    </div>
</template>

<script>
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        DocGif: () => import("~/components/Messages/Attachments/Doc/Gif"),
        InlineDoc: () => import("~/components/Modal/Views/AddAttachments/Components/Doc/Inline.vue")
    },

    mixins: [AttachmentMixin]
};
</script>

<style lang="scss">
.attachments-item-doc {
    width: 100%;
    height: 100%;

    .inline-doc {
        border-bottom: none;
        
        span {
            color: var(--contrast);
        }
    }
}
</style>