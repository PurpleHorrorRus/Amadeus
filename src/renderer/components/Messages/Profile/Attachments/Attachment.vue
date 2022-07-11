<template>
    <div class="profile-attachments-item">
        <GalleryPhoto 
            v-if="item.type === 'photo'" 
            :item="item" :index="index" 
        />

        <GalleryVideo 
            v-else-if="item.type === 'video'" 
            :item="item" 
            :index="index" :canQuickPlay="false" 
        />

        <AttachmentAudio 
            v-else-if="item.type === 'audio'" 
            :item="item" 
        />

        <AttachmentsDoc 
            v-else-if="item.type === 'doc'" 
            :item="item" 
        />
    </div>
</template>

<script>
export default {
    components: {
        GalleryPhoto: () => import("~/components/Messages/Attachments/Gallery/Photo"),
        GalleryVideo: () => import("~/components/Messages/Attachments/Gallery/Video"),
        AttachmentAudio: () => import("~/components/Messages/Attachments/Audio"),
        AttachmentsDoc: () => import("~/components/Messages/Attachments/Doc")
    },

    props: {
        item: {
            type: Array,
            required: true
        },

        index: {
            type: Number,
            required: true
        }
    },

    computed: {
        data() {
            return this.$parent.attachments;
        }
    }
};
</script>

<style lang="scss">
.profile-attachments-item {
    cursor: pointer;

    .attachments-item {
        object-fit: cover;
    }

    .attachments-item-photo {
        width: 95px;
        height: 95px;

        border-radius: 8px;
    }

    .attachments-item-doc-gif-preview {
        width: 95px;
        height: 95px;
    }
    
    .attachments-item-doc-gif-playing {
        width: 20vw;
    }
}
</style>