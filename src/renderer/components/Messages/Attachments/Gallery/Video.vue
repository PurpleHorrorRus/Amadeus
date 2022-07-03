<template>
    <div class="gallery-item gallery-item-video" :style="itemStyle">
        <div class="gallery-item-video-preview" :style="previewStyle">
            <img :src="preview" class="gallery-item-video-preview-image">
            <PlayRoundIcon class="icon" />
        </div>

        <div 
            v-if="showTitle"
            class="gallery-item-video-title nowrap" 
            v-text="item.video.title" 
        />
    </div>
</template>

<script>
import GalleryMixin from "~/components/Messages/Attachments/Gallery/Gallery";

export default {
    components: {
        PlayRoundIcon: () => import("~/assets/icons/play-round.svg")
    },

    mixins: [GalleryMixin],

    data: () => ({
        preview: ""
    }),

    computed: {
        showTitle() {
            return this.$parent.data.length === 1;
        }
    },

    created() {
        this.preview = this.calculateMaxSize(this.item.video.image);
    }
};
</script>

<style lang="scss">
.gallery-item-video {
    display: grid;
    row-gap: 8px;

    &:hover {
        .gallery-item-video-title {
            text-decoration: underline;
        }
    }

    &-preview {
        position: relative;

        display: flex;
        align-items: center;
        justify-content: center;

        background-size: cover !important;
        border-radius: 8px;

        &-image {
            width: 100%;
            height: auto;

            border-radius: 8px;
        }

        .icon {
            position: absolute;

            width: 40%;

            path {
                fill: var(--secondary);
                stroke: #000000;
                stroke-width: 1px;
            }
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