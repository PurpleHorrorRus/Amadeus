<template>
    <div class="profile-attachments-item">
        <GalleryPhoto
            v-if="item.type === 'photo'"
            :item="item" :index="index"
            @click.native.stop="openMedia(data, index)"
        />

        <GalleryVideo
            v-else-if="item.type === 'video'"
            :item="item"
            :index="index" :canQuickPlay="false"
            :showTitle="false"
            @click.native.stop="openMedia(data, index)"
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

<script lang="ts">
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        GalleryPhoto: () => import("~/components/Messages/Attachments/Gallery/Photo.vue"),
        GalleryVideo: () => import("~/components/Messages/Attachments/Gallery/Video.vue"),
        AttachmentAudio: () => import("~/components/Messages/Attachments/Audio.vue"),
        AttachmentsDoc: () => import("~/components/Messages/Attachments/Doc.vue")
    },

    mixins: [AttachmentMixin],

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
    width: 31%;
    min-height: 80px;

    cursor: pointer;

    .attachments-item {
        object-fit: cover;
    }

    .attachments-item-photo {
        width: 100%;
        height: 80px;

        border-radius: 8px;
    }

    .attachments-item-doc-file {
        width: 20rem;
    }
}
</style>