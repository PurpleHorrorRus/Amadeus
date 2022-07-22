<template>
    <div class="solid-button" :class="{ disabled }">
        <span v-if="!load" class="solid-button-label" v-text="label" />
        <LoaderIcon v-else class="icon loader-icon spin" />
    </div>
</template>

<script lang="ts">
export default {
    props: {
        load: {
            type: Boolean,
            required: false,
            default: false
        },

        label: {
            type: String,
            required: true
        },

        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    }
};
</script>

<style lang="scss">
.solid-button {
    display: flex;
    justify-content: center;
    align-items: center;

    min-width: 60px;
    width: max-content;
    max-width: 400px;
    height: 30px;

    padding: 8px;

    background: var(--secondary);
    border-radius: 4px;

    font-size: 11px;
    text-align: center;

    transition: all 0.5s ease;

    &.disabled {
        cursor: not-allowed;
        background: var(--secondary-disabled);

        * {
            &:hover {
                cursor: not-allowed;
            }
        }
    }

    &:not(.disabled) {
        span {
            cursor: pointer;
        }

        &:hover {
            cursor: pointer;
            background: var(--secondary-opacity-half);
        }
    }

    .icon {
        width: 16px;
    }
}
</style>