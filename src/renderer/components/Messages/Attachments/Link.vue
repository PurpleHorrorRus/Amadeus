<template>
    <div class="attachments-item attachments-item-link" @click="openExternal(item.link.url)">
        <img :src="preview" class="attachments-item-link-image">

        <div class="attachments-item-link-information nowrap">
            <span 
                class="attachments-item-link-information-title nowrap" 
                v-text="item.link.title" 
            />

            <span 
                class="attachments-item-link-information-caption small-text nowrap" 
                v-text="item.link.caption" 
            />
        </div>
    </div>
</template>

<script>
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    mixins: [AttachmentMixin],

    data: () => ({
        preview: ""
    }),

    created() {
        this.preview = this.calculateMaxSize(this.item.link.photo.sizes);
    }
};
</script>

<style lang="scss">
.attachments-item-link {
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-template-rows: 1fr;
    column-gap: 10px;

    &:hover {
        .attachments-item-link-information-title {
            color: var(--secondary);
        }
    }

    &-image {
        width: 40px;
        height: 40px;

        border-radius: 100%;
    }

    &-information {
        display: flex;
        flex-direction: column;
        justify-content: center;
        
        &-title {
            font-size: 12px;
        }
    }
}
</style>