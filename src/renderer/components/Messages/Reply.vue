<template>
    <div class="message-content-reply nowrap">
        <span
            class="message-content-reply-name nowrap"
            v-text="profile.name"
        />

        <span
            v-if="showAttachments"
            class="message-content-reply-attachments"
            v-text="formatAttachmentsString(message)"
        />

        <span
            v-if="message.text"
            class="message-content-reply-text nowrap"
            v-text="formatText(message.text)"
        />
    </div>
</template>

<script lang="ts">
import { mapState } from "vuex";

import CoreMixin from "~/mixins/core";
import ProfileMixin from "~/mixins/profile";
import AttachmentsMixin from "~/mixins/attachments";

export default {
    mixins: [CoreMixin, ProfileMixin, AttachmentsMixin],

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
            current: (state: any) => state.vk.messages.current,
            user: (state: any) => state.vk.user
        }),

        showAttachments() {
            return this.message.attachments?.length > 0 ||
                this.message.fwd_messages?.length > 0;
        }
    },

    created() {
        if (this.current.isChat) {
            this.profile = this.current.users.find(user => {
                return user.id === this.message.from_id;
            });

            return this.profile;
        }

        this.profile = this.message.from_id !== this.user.id
            ? this.current
            : this.user;
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

    border-left: 4px solid var(--contrast);

    span {
        user-select: text;
    }

    &-attachments, &-text {
        font-size: 12px;
    }
}
</style>