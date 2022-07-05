<template>
    <div 
        class="attachments-item attachments-item-video" 
        :style="itemStyle" 
        @click="openVideo"
    >
        <div class="attachments-item-video-preview" :style="previewStyle">
            <img v-if="preview" :src="preview" class="attachments-item-video-preview-image">
            <div v-else class="attachments-item-video-preview-empty" />

            <PlayIcon v-if="!isRestrict" class="icon" />
            <BlockIcon v-else class="icon block" />
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
        PlayIcon: () => import("~/assets/icons/play.svg"),
        BlockIcon: () => import("~/assets/icons/block.svg")
    },

    mixins: [GalleryMixin],

    data: () => ({
        preview: ""
    }),

    computed: {
        showTitle() {
            return this.$parent.data.length === 1;
        },

        isRestrict() {
            return Boolean(this.item.video.restriction);
        }
    },

    created() {
        this.preview = this.item.video.image
            ? this.calculateMaxSize(this.item.video.image)
            : "";
    },

    methods: {
        openVideo() {
            if (this.isRestrict) {
                return false;
            }

            return this.openMedia(this.$parent.data, this.index);
        }
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

        background: var(--backdrop);
        background-size: cover !important;
        border-radius: 8px;

        &-image {
            width: 100%;
            height: auto;

            border-radius: 8px;
        }
        
        &-empty {
            width: 35vw;
            height: 20vw;
            
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

            &.block {
                path {
                    fill: var(--icons);
                }
            }
        }
    }
}
</style>