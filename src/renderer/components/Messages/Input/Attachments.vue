<template>
    <div id="message-page-input-attachments">
        <MessageReply 
            v-if="input.reply" 
            :message="input.reply" 
            @click.native="removeReply"
        />

        <MessageForwardedMessages 
            v-if="showForwardedMessages"
            :messages="input.fwd_messages"
            @click.native="removeForward"
        />

        <MessageAttachmentsGallery 
            v-if="input.attachments.length > 0"
            :attachments="input.attachments"
        />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
    components: {
        MessageReply: () => import("~/components/Messages/Reply"),
        MessageForwardedMessages: () => import("~/components/Messages/ForwardedMessages"),
        MessageAttachmentsGallery: () => import("~/components/Messages/Input/Gallery")
    },

    computed: {
        ...mapState({
            input: state => state.input
        }),

        showForwardedMessages() {
            return this.input.fwd_messages.length > 0;
        }
    },

    methods: {
        ...mapActions({
            removeReply: "input/REMOVE_REPLY",
            removeForward: "input/REMOVE_FORWARD"
        })
    }
};
</script>

<style lang="scss">
#message-page-input-attachments {
    grid-area: attachments;

    max-height: 40vh;

    overflow-y: auto;

    .message-content-attachments {
        max-width: 30vw;
    }

    .message-content-reply {
        border-left: 4px solid var(--secondary);
        cursor: pointer;
    }

    .message-content-forwarded-messages {
        cursor: pointer;

        * {
            cursor: pointer !important;
        }
    }
}
</style>