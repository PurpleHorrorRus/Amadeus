<template>
    <div class="attachments-item attachments-item-fwd">
        <FwdRepost 
            :item="message"
            :icon="icon"
        />

        <AllAttachments :message="message" />
    </div>
</template>

<script>
import CoreMixin from "~/mixins/core";
import AttachmentsMixin from "~/mixins/attachments";
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        FwdRepost: () => import("~/components/Messages/Attachments/Wall/Repost"),
        AllAttachments: () => import("~/components/Messages/AllAttachments")
    },

    mixins: [CoreMixin, AttachmentsMixin, AttachmentMixin],

    props: {
        message: {
            type: Object,
            required: true
        }
    },

    data: () => ({
        attachments: [],
        profile: null,

        icon: () => import("~/assets/icons/reply.svg")
    })
};
</script>

<style lang="scss">
.attachments-item-fwd {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    .attachments-item-fwd, .attachments-item-wall {
        margin-left: 1vw;
    }

    .attachments-item-repost-icon {
        transform: scale(-1, -1);
    }

    &-text {
        font-size: 12px;

        white-space: pre-line;
        user-select: text;

        cursor: text;
    }
}
</style>