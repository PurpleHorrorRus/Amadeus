<template>
    <div class="notification-information-text nowrap">
        <span
            v-if="$parent.notification.message.attachments?.length > 0"
            class="notification-information-text__attachments small-text"
            v-text="formattedText"
        />

        <span
            class="notification-information-text__main nowrap small-text"
            v-text="$parent.notification.message.text"
        />
    </div>
</template>

<script lang="ts">
import AttachmentsMixin from "~/mixins/message/attachments";

export default {
    mixins: [AttachmentsMixin],

    computed: {
        formattedText() {
            return this.formatAttachmentsString(this.$parent.notification.message, false);
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