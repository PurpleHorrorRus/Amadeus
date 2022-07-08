<template>
    <div class="context-menu-item">
        <span class="context-menu-item-label" v-text="label" />
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: false,
            default: "(not set)"
        }
    }
};
</script>

<style lang="scss">
.context-menu-item {
    display: flex;
    align-items: center;

    padding: 10px;

    border-radius: 4px;
    transition: background .08s ease-in-out;

    cursor: pointer;

    &:hover {
        background: var(--item-hover);
    }

    span {
        font-size: 12px;
    }
}
</style>