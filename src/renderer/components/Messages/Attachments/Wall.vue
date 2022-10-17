<template>
    <div class="attachments-item attachments-item-wall">
        <WallRepost :item="item" />

        <span
            v-if="item.text"
            class="attachments-item-wall-text break"
            v-text="item.text"
        />

        <MessageAttachments
            v-if="item.attachments.length > 0"
            :message="item"
        />

        <SolidButton
            :label="$strings.CHAT.ATTACHMENTS.WALL.OPEN"
            @click.native="openWall"
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
    }),

    methods: {
        openWall() {
            return this.openExternal(`https://vk.com/wall${this.item.owner_id}_${this.item.id}`);
        }
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
        color: var(--contrast);
        font-size: 12px;

        cursor: text;
    }

    .solid-button {
        width: 100%;

        align-self: center;

        background: none;
        border: 1px solid var(--contrast);
    }
}
</style>