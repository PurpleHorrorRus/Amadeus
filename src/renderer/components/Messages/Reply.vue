<template>
    <div class="message-content-reply nowrap">
        <span 
            class="message-content-reply-name nowrap"
            v-text="name(profile)"
        />

        <span 
            v-if="showAttachments"
            class="message-content-reply-attachments" 
            v-text="formatAttachmentsString(message)" 
        />

        <span 
            v-if="message.text"
            class="message-content-reply-text nowrap" 
            v-text="message.text" 
        />
    </div>
</template>

<script>
import { mapState } from "vuex";

import ProfileMixin from "~/mixins/profile";
import AttachmentsMixin from "~/mixins/attachments";

export default {
    mixins: [ProfileMixin, AttachmentsMixin],

    props: {
        message: {
            type: Object,
            required: true
        }
    },

    data: () => ({
        profile: null
    }),

    computed: {
        ...mapState({
            conversations: state => state.vk.conversations.cache,
            current: state => state.vk.messages.current
        }),

        showAttachments() {
            return this.message.attachments?.length > 0
                || this.message.fwd_messages?.length > 0;
        }
    },

    created() {
        const conversation = this.conversations[this.current];
        this.profile = conversation.profile.type !== "chat"
            ? conversation.profile
            : conversation.profile.users.find(user => user.id === this.message.from_id);
    }
};
</script>

<style lang="scss">
.message-content-reply {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    padding-left: 10px;

    border-left: 4px solid var(--secondary);

    span {
        user-select: text;
    }

    &-attachments, &-text {
        font-size: 12px;
    }
}
</style>