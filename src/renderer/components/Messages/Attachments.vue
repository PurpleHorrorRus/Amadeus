<template>
    <div class="message-content-attachments">
        <AttachmentWall
            v-if="attachments[0].type === 'wall'" 
            :item="attachments[0]"
        />

        <Gallery 
            v-if="galleryItems.length > 0"
            :data="galleryItems" 
        />

        <AttachmentSticker 
            v-if="attachments[0].type === 'sticker'" 
            :item="attachments[0]"
        />

        <AttachmentStory
            v-else-if="attachments[0].type === 'story'" 
            :item="attachments[0]"
        />
    </div>
</template>

<script>
export default {
    components: {
        AttachmentWall: () => import("~/components/Messages/Attachments/Wall"),
        Gallery: () => import("~/components/Messages/Attachments/Gallery"),
        AttachmentSticker: () => import("~/components/Messages/Attachments/Sticker"),
        AttachmentStory: () => import("~/components/Messages/Attachments/Story")
    },

    props: {
        attachments: {
            type: Array,
            required: true
        }
    },

    computed: {
        galleryItems() {
            return this.attachments.filter(attachment => {
                return attachment.type === "photo" 
                    || attachment.type === "video";
            });
        }
    }
};
</script>

<style lang="scss">
.message.out:not(.noBackground) .attachments-item-title {
    color: var(--text);
}

.attachments-item {
    &:hover {
        cursor: pointer;

        .attachments-item-title {
            text-decoration: underline;
        }
    }

    &-title {
        margin-left: 5px;

        color: var(--secondary);
        font-size: 12px;
        font-weight: 400;
    }
}
</style>