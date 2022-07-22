<template>
    <div class="attachments-item-story-preview-expired">
        <BlockIcon class="icon" />
        <span 
            class="attachmnets-item-story-preview-expired-label small-text" 
            v-text="$strings.CHAT.ATTACHMENTS.STORY_EXPIRED" 
        />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        BlockIcon: () => import("~icons/block.svg")
    }
};
</script>

<style lang="scss">
.attachments-item-story-preview-expired {
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

    &-label {
        text-align: center;
    }

    .icon {
        width: 36px;

        path {
            fill: none;
        }
    }
}
</style>