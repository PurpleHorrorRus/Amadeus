<template>
    <div class="unread-counter">
        <span class="unread-counter-count" v-text="count" />
    </div>
</template>

<script lang="ts">
export default {
    props: {
        count: {
            type: Number,
            required: true
        }
    }
};
</script>

<style lang="scss">
.unread-counter {
    display: flex;
    justify-content: center;
    align-items: center;
    justify-self: center;
    align-self: center;

    width: 20px;
    height: 20px;

    background: var(--secondary);
    border-radius: 100%;

    &-count {
        font-size: 11px;
        font-weight: 500;
    }
}
</style>