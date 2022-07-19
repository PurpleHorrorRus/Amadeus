<template>
    <div 
        class="attachments-item attachments-item-video" 
        :class="videoClass" 
        :style="itemStyle"
    >
        <div class="attachments-item-video-preview" :style="previewStyle">
            <VideoBlock v-if="item.restriction" />

            <img 
                v-else-if="!quick && item.sizes.medium" 
                :src="item.sizes.medium" 
                class="attachments-item-video-preview-image"
            >

            <iframe 
                v-else-if="quick" 
                :src="item.player" 
                class="attachments-item-video-preview-quick"
            />

            <PlayIcon 
                v-if="canQuick" 
                id="video-play-icon"
                class="icon" 
                @click.stop="quickPlay" 
            />
        </div>

        <span 
            v-if="showTitle"
            class="attachments-item-title attachments-item-video-title nowrap" 
            v-text="item.title"
        />
    </div>
</template>

<script>
import GalleryMixin from "~/components/Messages/Attachments/Gallery/Gallery";

export default {
    components: {
        VideoBlock: () => import("~/components/Messages/Attachments/Video/Block.vue"),
        PlayIcon: () => import("~icons/play.svg")
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
        quick: false
    }),

    computed: {
        videoClass() {
            return {
                title: this.showTitle
            };
        },

        canQuick() {
            return this.canQuickPlay 
                && !this.quick 
                && !this.item.restriction;
        }
    },

    methods: {
        quickPlay() {
            this.quick = true;
        }
    }
};
</script>

<style lang="scss">
.attachments-item-video {
    display: grid;
    grid-template-rows: 100%;
    row-gap: 8px;

    height: 100%;

    &.title {
        grid-template-rows: 1fr 35px;
    }

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

        &-quick {
            height: 35vh;
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