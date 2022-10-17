<template>
    <div class="gallery" :class="galleryClass">
        <Component
            :is="render(attachment)"
            v-for="(attachment, index) of data"
            :key="index"
            :item="attachment"
            :index="index"
            :showTitle="data.length === 1"
            @click.native.stop="openMedia(data, index)"
        />
    </div>
</template>

<script lang="ts">
import AttachmentPhoto from "~/components/Messages/Attachments/Gallery/Photo.vue";
import AttachmentVideo from "~/components/Messages/Attachments/Gallery/Video.vue";

import AttachmentMixin from "~/components/Messages/Attachments/Attachment";
import AttachmentsMixin from "~/mixins/message/attachments";

export default {
    mixins: [AttachmentMixin, AttachmentsMixin],

    computed: {
        galleryClass() {
            return {
                [`grid-${this.data.length}`]: true
            };
        }
    },

    methods: {
        render(attachment) {
            switch (attachment.type) {
                case "photo": return AttachmentPhoto;
                case "video": return AttachmentVideo;
            }
        }
    }
};
</script>

<style lang="scss">
.gallery {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    align-items: flex-start;

    &-item {
        height: 100%;

        cursor: pointer;
    }

    &:not(.grid-1) {
        gap: 5px;
    }

    &.grid-1 {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        grid-template-areas: "item-1";

        .attachments-item-photo {
            height: 40vh;
        }
    }

    &.grid-2 {
        grid-template-columns: 2fr 1fr;
        grid-template-rows: 1fr;
        grid-template-areas: "item-1 item-2";
    }

    &.grid-3 {
        grid-template-columns: 3fr 1fr;
        grid-template-rows: max-content max-content;
        grid-template-areas: "item-1 item-2"
                            "item-1 item-3";
    }

    &.grid-4 {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: 270px 1fr;
        grid-template-areas: "item-1 item-1 item-1"
                            "item-2 item-3 item-4";
    }

    &.grid-5 {
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: 160px;
        grid-template-areas: "item-1 item-1 item-1 item-1"
                            "item-2 item-3 item-4 item-5";
    }

    &.grid-6 {
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: 1fr 120px;
        grid-template-areas: "item-1 item-1 item-1 item-1 item-1"
                            "item-2 item-3 item-4 item-5 item-6";
    }

    &.grid-7 {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: 1fr 120px 120px;
        grid-template-areas: "item-1 item-1 item-1"
                            "item-2 item-3 item-4"
                            "item-5 item-6 item-7";
    }

    &.grid-8 {
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: 1fr 1fr;
        grid-template-areas: "item-1 item-2 item-3 item-4"
                            "item-5 item-6 item-7 item-8";
    }

    &.grid-9 {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: 1fr;
        grid-template-areas: "item-1 item-2 item-3"
                            "item-4 item-5 item-6"
                            "item-7 item-8 item-9";
    }

    &.grid-10 {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: 270px repeat(3, 135px);
        grid-template-areas: "item-1 item-1 item-1"
                            "item-2 item-3 item-4"
                            "item-5 item-6 item-7"
                            "item-8 item-9 item-10";
    }
}
</style>