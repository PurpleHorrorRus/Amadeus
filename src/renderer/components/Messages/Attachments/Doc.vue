<template>
    <div class="attachments-item attachments-item-doc">
        <DocGif v-if="isGif" :item="item" />
        <DocFile v-else :item="item" />
    </div>
</template>

<script>
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        DocGif: () => import("~/components/Messages/Attachments/Doc/Gif"),
        DocFile: () => import("~/components/Messages/Attachments/Doc/File")
    },

    mixins: [AttachmentMixin],

    computed: {
        isGif() {
            return this.item.doctype === 3;
        }
    }
};
</script>

<style lang="scss">

</style>