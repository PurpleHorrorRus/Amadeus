<template>
    <div 
        class="attachments-item attachments-item-video" 
        :style="itemStyle" 
        @click.stop="openVideo"
    >
        <div class="attachments-item-video-preview" :style="previewStyle">
            <img 
                v-if="!quick && preview.url" 
                :src="preview.url" 
                class="attachments-item-video-preview-image"
            >
            
            <iframe 
                v-else-if="quick" 
                :src="item.video.player" 
                class="attachments-item-video-preview-quick"
            />
            
            <div v-else class="attachments-item-video-preview-empty">
                <BlockIcon class="icon block" />
            </div>

            <PlayIcon 
                v-if="canQuick" 
                class="icon" 
                @click.stop="quickPlay" 
            />
        </div>

        <span 
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

    props: {
        canQuickPlay: {
            type: Boolean,
            required: false,
            default: true
        },

        showTitle: {
            type: Boolean,
            required: false,
            default: true
        }
    },

    data: () => ({
        preview: {},
        quick: false
    }),

    computed: {
        canQuick() {
            return this.canQuickPlay 
                && !this.quick 
                && !this.isRestrict;
        },

        isRestrict() {
            return Boolean(this.item.video.restriction);
        }
    },

    created() {
        if (this.item.video.image) {
            this.preview = this.calculateMaxSize(this.item.video.image);
        }
    },

    methods: {
        openVideo() {
            if (this.isRestrict) {
                return false;
            }

            return this.openMedia(this.$parent.data, this.index);
        },

        quickPlay() {
            this.quick = true;
        }
    }
};
</script>

<style lang="scss">
.attachments-item-video {
    display: grid;
    grid-template-rows: 1fr;
    row-gap: 8px;

    height: 100%;

    &-preview {
        position: relative;

        display: flex;
        align-items: center;
        justify-content: center;

        background: var(--backdrop);
        background-size: cover !important;
        background-position: center center !important;
        border-radius: 8px;

        &-image {
            object-fit: cover;
        }

        &-image, &-quick, &-empty {
            width: 100%;
            height: 100%;

            border-radius: 8px;
            border: none;
        }

        &-empty {
            display: flex;
            justify-content: center;
            align-items: center;

            width: 100%;
            height: 100%;
        }

        .icon {
            position: absolute;

            width: 20%;
            min-width: 30px;

            path {
                fill: var(--icons);
                stroke: #000000;
                stroke-width: 1px;
            }

            &:not(.block) {
                &:hover {
                    path {
                        fill: var(--icons-hover);
                    }
                }
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