<template>
    <div class="message-attachment-item">
        <XIcon class="icon remove-icon" @click="$emit('remove')" />

        <WallRepost
            v-if="item.type === 'wall'"
            :item="item"
        />

        <GalleryPhoto
            v-else-if="item.type === 'photo'"
            :item="item"
            :index="index"
        />

        <GalleryVideo
            v-else-if="item.type === 'video'"
            :item="item"
            :index="index"
            :showTitle="false"
            :canQuickPlay="false"
        />

        <AttachmentAudio
            v-else-if="item.type === 'audio'"
            :item="item"
        />

        <AttachmentsGif
            v-else-if="item.isGif"
            :item="item"
        />
    </div>
</template>

<script lang="ts">
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        WallRepost: () => import("~/components/Messages/Attachments/Wall/Repost.vue"),
        GalleryPhoto: () => import("~/components/Messages/Attachments/Gallery/Photo.vue"),
        GalleryVideo: () => import("~/components/Messages/Attachments/Gallery/Video.vue"),
        AttachmentAudio: () => import("~/components/Messages/Attachments/Audio.vue"),
        AttachmentsGif: () => import("~/components/Messages/Attachments/Doc.vue"),

        XIcon: () => import("~icons/x.svg")
    },

    mixins: [AttachmentMixin],

    computed: {
        data() {
            return this.$parent.attachments;
        }
    }
};
</script>

<style lang="scss">
.message-attachment-item {
    position: relative;

    width: 130px;
    height: 130px;

    background: var(--backdrop);

    img {
        object-fit: contain !important;
    }

    .attachments-item {
        &.attachments-item-photo {
            height: 100% !important;
        }

        &.attachments-item-video {
            .attachments-item-video-preview, .attachments-item-video-playing {
                height: 100% !important;
            }
        }

        &.attachments-item-doc {
            width: 100%;
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
        top: -5px; right: -10px;

        width: 30px;
        padding: 7px;

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