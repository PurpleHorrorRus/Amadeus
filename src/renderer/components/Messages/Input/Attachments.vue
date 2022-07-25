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
            :hideName="true"
            @click.native="removeForward"
        />

        <CompactAttachment
            v-else-if="input.attachments[0].type === 'wall'"
            :message="input"
            :text="$strings.CHAT.ATTACHMENTS.WALL"
            @click.native="removeAttachment(0)"
        />

        <CompactAttachment
            v-else-if="input.attachments[0].type === 'audio_playlist'"
            :message="input"
            :text="$strings.CHAT.ATTACHMENTS.AUDIO_PLAYLIST"
            @click.native="removeAttachment(0)"
        />

        <CompactAttachment
            v-if="input.geo"
            :message="input"
            :text="$strings.CHAT.ATTACHMENTS.MAP"
        />

        <AttachmentsDocs
            v-if="docItems.length > 0"
            :items="docItems"
            @remove="removeDoc"
        />

        <MessageAttachmentsGallery
            v-if="galleryItems.length > 0"
            :attachments="galleryItems"
            @sort="sort"
        />
    </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";

import CoreMixin from "~/mixins/core";
import AttachmentsMixin from "~/mixins/attachments";

export default {
    components: {
        CompactAttachment: () => import("~/components/Messages/Input/CompactAttachment.vue"),
        AttachmentsDocs: () => import("~/components/Messages/Input/Attachments/Docs.vue"),
        MessageAttachmentsGallery: () => import("~/components/Messages/Input/Gallery.vue")
    },

    mixins: [CoreMixin, AttachmentsMixin],

    computed: {
        ...mapState({
            input: (state: any) => state.input
        }),

        galleryItems() {
            return this.input.attachments.filter(attachment => {
                return attachment.type === "photo"
                    || attachment.type === "video"
                    || attachment.isGif;
            }) || [];
        },

        docItems() {
            return this.input.attachments.filter(attachment => {
                return attachment.type === "doc" && attachment.doctype !== 3;
            });
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
            moveAttachments: "input/MOVE_ATTACHMENTS",
            removeAttachment: "input/REMOVE_ATTACHMENT",
            removeReply: "input/REMOVE_REPLY",
            removeForward: "input/REMOVE_FORWARD"
        }),

        sort({ moved }) {
            return this.moveAttachments(moved);
        }
    }
};
</script>

<style lang="scss">
#message-page-input-attachments {
    grid-area: attachments;

    width: 100%;

    overflow: hidden;

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