<template>
    <div class="message-content-reply nowrap">
        <CompactAttachment
            :message="reply"
            :text="replyText(reply)"
        />
    </div>
</template>

<script lang="ts">
import ReplyMixin from "~/mixins/message/reply";

export default {
    components: {
        CompactAttachment: () => import("~/components/Messages/Input/CompactAttachment.vue")
    },

    mixins: [ReplyMixin],

    props: {
        reply: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
.message-content-reply {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    span {
        user-select: text;
    }

    &-attachments, &-text {
        font-size: 12px;
    }

    &-name {
        font-size: 14px;
    }
}
</style>