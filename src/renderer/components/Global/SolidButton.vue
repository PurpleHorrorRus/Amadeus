<template>
    <div class="solid-button" :class="{ disabled }">
        <span v-if="!load" class="solid-button-label" v-text="label" />
        <LoaderIcon v-else class="icon loader-icon" />
    </div>
</template>

<script>
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

    padding: 16px 12px;

    background-color: var(--secondary);
    border-radius: 4px;

    font-size: 12px;
    text-align: center;

    transition: background .25s ease;

    &.disabled {
        cursor: not-allowed;
        background-color: var(--secondary-disabled);

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
            background-color: var(--secondary-opacity-half);
        }
    }

    .icon {
        width: 16px;
    }

    &-label {
        color: var(--buttons-text);
        font-weight: 600;
        text-transform: uppercase;
    }
}
</style>