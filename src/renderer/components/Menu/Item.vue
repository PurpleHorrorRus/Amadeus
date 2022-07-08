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
    transition: background .2s ease-in;

    cursor: pointer;

    &:hover {
        background: var(--item-hover);
    }
}
</style>