<template>
    <div class="message-content-all-attachments">
        <MessageReply 
            v-if="message.reply_message"
            :message="message.reply_message"
        />

        <div v-if="showForwardedMessages" class="message-content-fwd">
            <ForwardedMessage 
                v-for="fwd of message.fwd_messages"
                :key="fwd.id"
                :message="fwd"
            />
        </div>

        <MessageText v-if="message.text" :message="message" />
        <MessageAttachments v-if="showAttachments" :message="message" />
    </div>
</template>

<script>
import AttachmentsMixin from "~/mixins/attachments";

export default {
    components: {
        MessageReply: () => import("~/components/Messages/Reply"),
        MessageText: () => import("~/components/Messages/Text"),
        ForwardedMessage: () => import("~/components/Messages/ForwardedMessage"),
        MessageAttachments: () => import("~/components/Messages/Attachments")
    },

    mixins: [AttachmentsMixin],

    props: {
        message: {
            type: Object,
            required: true
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