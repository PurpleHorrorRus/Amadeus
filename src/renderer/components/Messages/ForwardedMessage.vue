<template>
    <div class="attachments-item attachments-item-fwd">
        <FwdRepost
            :item="message"
            :icon="icon"
        />

        <AllAttachments :message="message" />
    </div>
</template>

<script lang="ts">
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

import CoreMixin from "~/mixins/core";
import AttachmentsMixin from "~/mixins/message/attachments";

export default {
    components: {
        FwdRepost: () => import("~/components/Messages/Attachments/Wall/Repost.vue"),
        AllAttachments: () => import("~/components/Messages/AllAttachments.vue")
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

        icon: () => import("~icons/reply.svg")
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
}
</style>