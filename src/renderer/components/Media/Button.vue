<template>
    <div class="media-page-button">
        <Component
            :is="icon"
            v-tooltip.top="tooltip"
            class="icon amadeus clickable"
        />
    </div>
</template>

<script lang="ts">
export default {
    props: {
        icon: {
            type: Object,
            required: true
        },

        tooltip: {
            type: String,
            required: false,
            default: ""
        }
    }
};
</script>

<style lang="scss">
.media-page-button {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 30px;
    height: 30px;

    background-color: var(--backdrop);
    border-radius: 100%;

    .icon {
        width: 20px;
    }
}
</style>