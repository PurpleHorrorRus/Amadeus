<template>
    <div class="message-attachment-item">
        <XIcon class="icon remove-icon" @click="$emit('remove')" />

        <Photo :item="item" />
    </div>
</template>

<script>
export default {
    components: {
        Photo: () => import("~/components/Messages/Attachments/Gallery/Photo"),

        XIcon: () => import("~/assets/icons/x.svg")
    },

    props: {
        item: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
.message-attachment-item {
    position: relative;

    max-width: 19%;

    .remove-icon {
        position: absolute;
        top: 3px; right: 3px;
        
        width: 36px;
        padding: 10px;

        background: var(--backdrop);
        border-radius: 100%;

        &:hover {
            cursor: pointer;
            
            path {
                stroke: var(--secondary);
            }
        }

        path {
            stroke: var(--text);
        }
    }
}
</style>