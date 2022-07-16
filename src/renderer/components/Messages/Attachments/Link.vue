<template>
    <div class="attachments-item attachments-item-link" @click.stop="openExternal(item.url)">
        <img :src="item.sizes.max" class="attachments-item-link-image">

        <div class="attachments-item-link-information">
            <span class="attachments-item-link-information-title" v-text="item.title" />

            <span 
                v-if="item.description" 
                class="attachments-item-link-information-description"
                v-text="item.description" 
            />

            <span 
                class="attachments-item-link-information-caption small-text" 
                v-text="item.caption" 
            />
        </div>
    </div>
</template>

<script>
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    mixins: [AttachmentMixin]
};
</script>

<style lang="scss">
.attachments-item-link {
    display: grid;
    grid-template-rows: 1fr max-content;

    width: 100%;

    border-radius: 8px;

    &-image {
        width: 100%;
        height: auto;

        border-radius: 8px 8px 0px 0px;

        object-fit: cover;
    }

    &-information {
        display: flex;
        flex-direction: column;
        row-gap: 10px;

        padding: 10px;

        background: var(--backdrop);
        border-radius: 0px 0px 8px 8px;

        span {
            font-size: 14px;
        }

        &-caption {
            font-size: 11px !important;
        }
    }
}
</style>