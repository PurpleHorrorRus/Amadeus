<template>
    <div class="message-attachment-item">
        <XIcon class="icon remove-icon" @click="$emit('remove')" />

        <WallRepost v-if="item.type === 'wall'" :item="item.wall" />
        <GalleryPhoto v-else-if="item.type === 'photo'" :item="item" />
        <GalleryVideo v-else-if="item.type === 'video'" :item="item" />
        <AttachmentAudio v-else-if="item.type === 'audio'" :item="item" />
        <AttachmentsDoc v-else-if="item.type === 'doc'" :item="item" />
    </div>
</template>

<script>
export default {
    components: {
        WallRepost: () => import("~/components/Messages/Attachments/Wall/Repost"),
        GalleryPhoto: () => import("~/components/Messages/Attachments/Gallery/Photo"),
        GalleryVideo: () => import("~/components/Messages/Attachments/Gallery/Video"),
        AttachmentAudio: () => import("~/components/Messages/Attachments/Audio"),
        AttachmentsDoc: () => import("~/components/Messages/Attachments/Doc"),

        XIcon: () => import("~/assets/icons/x.svg")
    },

    props: {
        item: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
.message-attachment-item {
    position: relative;

    width: max-content;

    .attachments-item {
        width: 15vw;

        &.attachments-item-doc {
            width: max-content;
        }

        &.attachments-item-audio {
            width: 20vw;
        }
    }

    .attachments-item-repost {
        width: 20vw;
    }

    .remove-icon {
        position: absolute;
        top: 3px; right: 3px;
        
        width: 36px;
        padding: 10px;

        background: var(--backdrop);
        border-radius: 100%;

        z-index: 1;

        &:hover {
            cursor: pointer;
            
            path {
                stroke: var(--secondary);
            }
        }

        path {
            stroke: var(--text);
        }
    }
}
</style>