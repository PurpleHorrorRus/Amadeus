<template>
    <div class="app-button">
        <Component
            :is="icon"
            class="icon"
        />
    </div>
</template>

<script lang="ts">
export default {
    props: {
        icon: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
.app-button {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 30px;
    height: 100%;

    &:hover {
        background-color: var(--titlebar-hover);
        cursor: pointer;
    }

    &.maximize {
        svg {
            width: 12px !important;
        }
    }

    &.close {
        &:hover {
            background-color: #910000;

            svg {
                stroke: #ffffff !important;
            }
        }
    }

    svg {
        width: 14px !important;

        stroke: var(--titlebar-color) !important;

        transition: none !important;

        &:hover {
            background: none;
        }
    }
}
</style>