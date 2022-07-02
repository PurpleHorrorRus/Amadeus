<template>
    <div class="message-content-attachments">
        <Gallery :data="galleryItems" />
    </div>
</template>

<script>
export default {
    components: {
        Gallery: () => import("~/components/Messages/Attachments/Gallery")
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
                return attachment.type === "photo" || attachment.type === "video";
            });
        }
    }
};
</script>

<style lang="scss">

</style>