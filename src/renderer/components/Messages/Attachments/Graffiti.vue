<template>
    <div class="attachments-item attachments-item-graffiti">
        <img :src="item.url" class="attachments-item-graffiti-image">
    </div>
</template>

<script>
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    mixins: [AttachmentMixin]
};
</script>

<style lang="scss">
.attachments-item-graffiti {
    width: 20vw;

    &-image {
        width: 100%;
        height: 100%;
    }
}
</style>