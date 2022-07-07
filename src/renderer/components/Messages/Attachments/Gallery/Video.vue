<template>
    <div 
        class="attachments-item attachments-item-video" 
        :style="itemStyle" 
        @click="openVideo"
    >
        <div class="attachments-item-video-preview" :style="previewStyle">
            <img v-if="!quick && preview" :src="preview" class="attachments-item-video-preview-image">
            <iframe 
                v-else-if="quick" 
                :src="item.video.player" 
                class="attachments-item-video-preview-quick"
            />
            <div v-else class="attachments-item-video-preview-empty" />

            <PlayIcon v-if="!quick && !isRestrict" class="icon" @click.stop="quickPlay" />
            <BlockIcon v-else-if="isRestrict" class="icon block" />
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
        preview: "",
        quick: false
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
        },

        quickPlay() {
            this.quick = true;
            console.log("quick");
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

        &-quick {
            width: 33vw;
            height: 19vw;

            border-radius: 8px;
            border: none;
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