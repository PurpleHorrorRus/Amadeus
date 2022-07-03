<template>
    <div class="message-content-attachments">
        <Gallery 
            v-if="galleryItems.length > 0"
            :data="galleryItems" 
        />

        <AttachmentSticker 
            v-if="attachments[0].type === 'sticker'" 
            :item="attachments[0]"
        />
    </div>
</template>

<script>
export default {
    components: {
        Gallery: () => import("~/components/Messages/Attachments/Gallery"),
        AttachmentSticker: () => import("~/components/Messages/Attachments/Gallery/Sticker")
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