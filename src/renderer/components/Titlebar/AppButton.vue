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
        background: var(--item);
        cursor: pointer;

        svg {
            stroke: var(--icons-hover) !important;
        }
    }

    &.maximize {
        svg {
            width: 12px !important;
        }
    }

    &.close {
        &:hover {
            background: #910000;

            svg {
                stroke: #ffffff !important;
            }
        }
    }

    svg {
        width: 14px !important;

        stroke: var(--icons) !important;

        transition: none !important;

        &:hover {
            background: none;
        }
    }
}
</style>