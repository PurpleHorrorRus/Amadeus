<template>
    <div 
        class="attachments-item attachments-item-video" 
        :style="itemStyle" 
        @click="openMedia($parent.data, index)"
    >
        <div class="attachments-item-video-preview" :style="previewStyle">
            <img :src="preview" class="attachments-item-video-preview-image">
            <PlayRoundIcon class="icon" />
        </div>

        <div 
            v-if="showTitle"
            class="attachments-item-title attachments-item-video-title nowrap" 
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
.attachments-item-video {
    display: grid;
    row-gap: 8px;

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

            width: 20%;
            min-width: 30px;

            path {
                fill: var(--secondary);
                stroke: #000000;
                stroke-width: 1px;
            }
        }
    }
}
</style>