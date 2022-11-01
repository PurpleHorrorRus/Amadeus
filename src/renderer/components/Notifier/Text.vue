<template>
    <div class="notification-information-text nowrap">
        <span
            v-if="showAttachments || showForwardedMessages"
            class="notification-information-text__attachments small-text"
            v-text="formattedText"
        />

        <span
            class="notification-information-text__main nowrap small-text"
            v-text="message.text"
        />
    </div>
</template>

<script lang="ts">
import Message from "~/instances/Messages/Message";

import AttachmentsMixin from "~/mixins/message/attachments";

export default {
    mixins: [AttachmentsMixin],

    props: {
        message: {
            type: Message,
            required: true
        }
    },

    computed: {
        formattedText() {
            return this.formatAttachmentsString(this.message, false);
        }
    }
};
</script>

<style lang="scss">
.notification-information-text {
    display: flex;
    flex-direction: row;
    column-gap: 5px;

    span {
        font-weight: 500;
    }

    &__attachments {
        color: var(--secondary) !important;
    }
}
</style>