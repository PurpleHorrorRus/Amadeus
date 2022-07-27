<template>
    <div class="suggests-block">
        <slot />
    </div>
</template>

<script lang="ts">
export default {

};
</script>

<style lang="scss">
.suggests-block {
    width: 100%;
    max-height: 40vh;

    padding: 10px;

    background: var(--backdrop);
    border: 1px solid var(--border);
    border-radius: 8px;

    overflow-y: auto;
}
</style>