<template>
    <div class="message-content-all-attachments">
        <MessageReply
            v-if="showReply"
            :reply="message.reply_message"
        />

        <MessageText
            v-if="message.text"
            :message="message"
        />

        <MessageForwardedMessages
            v-if="showForwardedMessages"
            :messages="message.fwd_messages"
        />

        <MessageAttachments
            v-if="showAttachments"
            :message="message"
        />
    </div>
</template>

<script lang="ts">
import AttachmentsMixin from "~/mixins/message/attachments";

export default {
    components: {
        MessageReply: () => import("~/components/Messages/Reply.vue"),
        MessageText: () => import("~/components/Messages/Text.vue"),
        MessageForwardedMessages: () => import("~/components/Messages/ForwardedMessages.vue"),
        MessageAttachments: () => import("~/components/Messages/Attachments.vue")
    },

    mixins: [AttachmentsMixin],

    props: {
        message: {
            type: Object,
            required: true
        },

        exclude: {
            type: Array,
            required: false,
            default: () => ([])
        }
    },

    computed: {
        showReply() {
            return this.message.reply_message
                && !this.exclude.includes("reply");
        }
    }
};
</script>

<style lang="scss">
.message-content-all-attachments {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
}
</style>