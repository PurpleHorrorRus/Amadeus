<template>
    <div class="attachments-item attachments-item-wall">
        <WallRepost :item="item" />

        <span 
            v-if="item.text"
            class="attachments-item-wall-text" 
            v-text="item.text" 
        />

        <MessageAttachments
            v-if="item.attachments.length > 0"
            :message="item"
        />
    </div>
</template>

<script lang="ts">
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        WallRepost: () => import("~/components/Messages/Attachments/Wall/Repost.vue"),
        MessageAttachments: () => import("~/components/Messages/Attachments.vue")
    },

    mixins: [AttachmentMixin],

    data: () => ({
        loaded: false,
        repost: null
    })
};
</script>

<style lang="scss">
.attachments-item-wall {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    .attachments-item-wall {
        margin-left: 1vw;
    }

    &-text {
        font-size: 12px;

        white-space: pre-line;
        user-select: text;

        cursor: text;
    }
}
</style>