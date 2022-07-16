<template>
    <div class="attachments-item attachments-item-story" :class="storyClass" @click.stop="openMedia([item], 0)">
        <div class="attachments-item-story-preview">
            <img
                v-if="!item.restriction"
                :src="item.sizes.max"
                class="attachments-item-story-preview-image"
            >
    
            <StoryExpired v-else />
        </div>
    </div>
</template>

<script>
import AttachmentMixin from "~/components/Messages/Attachments/Attachment";

export default {
    components: {
        StoryExpired: () => import("~/components/Messages/Attachments/Story/Expired")
    },

    mixins: [AttachmentMixin],

    computed: {
        storyClass() {
            return { 
                expired: this.item.restriction,
                clickable: !this.item.restriction
            };
        }
    }
};
</script>

<style lang="scss">
.attachments-item-story {
    display: flex;
    flex-direction: column;
    row-gap: 5px;

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
    }
}
</style>