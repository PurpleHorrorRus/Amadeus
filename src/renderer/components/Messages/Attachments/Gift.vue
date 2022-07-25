<template>
    <div class="attachments-item attachments-item-gift">
        <img :src="item.image" class="attachments-item-gift-image">
        <span
            class="attachments-item-gift-label"
            v-text="$strings.CONVERSATIONS.ATTACHMENTS.GIFT"
        />
    </div>
</template>

<script lang="ts">
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    mixins: [AttachmentMixin]
};
</script>

<style lang="scss">
.attachments-item-gift {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 10px;

    &-image {
        width: 100%;
        height: 100%;

        border: 2px solid var(--secondary);
        border-radius: 12px;
    }
}
</style>