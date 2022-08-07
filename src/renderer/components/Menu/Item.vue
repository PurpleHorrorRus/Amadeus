<template>
    <div class="context-menu-item" @click="$emit('select')">
        <Component :is="item.icon" v-if="item.icon" class="icon amadeus" />
        <span class="context-menu-item-label" v-text="item.label" />
    </div>
</template>

<script lang="ts">
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
.context-menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 5px;

    padding: 10px 5px;

    border-radius: 4px;
    transition: background .08s ease-in-out;

    cursor: pointer;

    &:hover {
        background: var(--item-hover);
    }

    .icon {
        width: 16px;
    }

    span {
        font-size: 12px;
    }
}
</style>