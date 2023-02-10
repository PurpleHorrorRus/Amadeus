<template>
    <div class="attachments-item attachments-item-graffiti">
        <nuxt-img
            :src="item.url"
            class="attachments-item-graffiti-image"
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
.attachments-item-graffiti {
    min-width: 170px;
    max-width: 320px;
    width: 20vw;

    &-image {
        width: 100%;
        height: 100%;
    }
}
</style>