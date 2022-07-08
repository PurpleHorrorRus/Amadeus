<template>
    <div class="attachments-item attachments-item-story" :class="storyClass" @click="open">
        <div class="attachments-item-story-preview">
            <img 
                v-if="!isExpired" 
                :src="preview.url" 
                class="attachments-item-story-preview-image"
            >

            <div v-else class="attachments-item-story-preview-expired">
                <BlockIcon class="icon" />
                <span 
                    class="attachmnets-item-story-preview-expired-label small-text" 
                    v-text="'Срок публикации истёк'" 
                />
            </div>
        </div>

        <span 
            class="attachments-item-story-title attachments-item-title" 
            v-text="'История'" 
        />
    </div>
</template>

<script>
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        BlockIcon: () => import("~/assets/icons/block.svg")
    },

    mixins: [AttachmentMixin],

    data: () => ({
        preview: ""
    }),

    computed: {
        storyClass() {
            return { 
                expired: this.isExpired,
                clickable: !this.isExpired
            };
        },

        isExpired() {
            return this.item.story.expires_at * 1000 < Date.now();
        }
    },

    created() {
        if (!this.isExpired) {
            this.preview = this.calculateMaxSize(this.item.story.video.image);
        }
    },

    methods: {
        open() {
            if (this.isExpired) {
                return false;
            }

            return this.openMedia([this.item], 0);
        }
    }
};
</script>

<style lang="scss">
.attachments-item-story {
    &.expired {
        width: 30vw;
    }

    &-preview {
        width: 30vw;
        height: 45vw;

        &-image {
            width: 100%;
            height: 100%;

            border-radius: 4px;
            object-fit: cover;
        }

        &-expired {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            flex-grow: 1;
            row-gap: 15px;

            width: 30vw;
            height: 45vw;
            min-width: 100%;

            background: var(--backdrop);
            border-radius: 4px;

            .icon {
                width: 36px;

                path {
                    fill: none;
                }
            }
        }
    }
}
</style>