<template>
    <div class="attachments-item attachments-item-wall">
        <WallRepost :item="item.wall" />

        <span 
            v-if="item.wall.text"
            class="attachments-item-wall-text" 
            v-text="item.wall.text" 
        />

        <MessageAttachments
            v-if="wall.attachments.length > 0"
            :message="wall"
        />
    </div>
</template>

<script>
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        WallRepost: () => import("~/components/Messages/Attachments/Wall/Repost"),
        MessageAttachments: () => import("~/components/Messages/Attachments")
    },

    mixins: [AttachmentMixin],

    data: () => ({
        loaded: false,
        wall: {},
        repost: null
    }),

    async created() {
        this.wall = this.item.wall;
        this.wall.attachments = this.item.wall.copy_history?.length > 0
            ? [{ 
                wall: this.item.wall.copy_history[0],
                type: "wall"
            }] : this.item.wall.attachments || [];
    }
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