<template>
    <div id="message-page-input-attachments">
        <CompactAttachment 
            v-if="input.reply"
            :message="input.reply"
            :text="replyText"
            @click.native="removeReply"
        />

        <CompactAttachment 
            v-else-if="showForwardMessages"
            :message="input"
            :text="forwardMessagesText"
            @click.native="removeForward"
        />

        <CompactAttachment 
            v-else-if="input.attachments[0].type === 'wall'"
            :message="input"
            :text="'Запись со стены'"
            @click.native="removeAttachment(0)"
        />

        <CompactAttachment 
            v-else-if="input.geo"
            :message="input"
            :text="'Карта'"
        />

        <MessageAttachmentsGallery 
            v-else-if="galleryItems.length > 0"
            :attachments="galleryItems"
        />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import CoreMixin from "~/mixins/core";
import AttachmentsMixin from "~/mixins/attachments";

export default {
    components: {
        CompactAttachment: () => import("~/components/Messages/Input/CompactAttachment"),
        MessageAttachmentsGallery: () => import("~/components/Messages/Input/Gallery")
    },

    mixins: [CoreMixin, AttachmentsMixin],

    computed: {
        ...mapState({
            input: state => state.input
        }),

        galleryItems() {
            return this.input.attachments?.filter(attachment => {
                return attachment.type === "photo"
                    || attachment.type === "video"
                    || attachment.type === "doc";
            }) || [];
        },

        replyText() {
            return `${this.formatAttachmentsString(this.input.reply, false)} 
                ${this.formatText(this.input.reply.text)}`;
        },

        showForwardMessages() {
            return this.input.fwd_messages?.length > 0;
        },

        forwardMessagesText() {
            return this.formatAttachmentsString(this.input, false);
        }
    },

    methods: {
        ...mapActions({
            removeAttachment: "input/REMOVE_ATTACHMENT",
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