<template>
    <div class="scroll-arrow">
        <ChevronDownIcon class="icon amadeus" />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        ChevronDownIcon: () => import("~icons/chevron-down.svg")
    }
};
</script>

<style lang="scss">
.scroll-arrow {
    width: 30px;
    height: 30px;

    display: flex;
    justify-content: center;
    align-items: center;

    background: var(--item);
    border-radius: 100%;
    transition: background .2s ease;

    cursor: pointer;

    &:hover {
        background: var(--item-hover);
    }

    .icon {
        width: 20px;
    }
}
</style>