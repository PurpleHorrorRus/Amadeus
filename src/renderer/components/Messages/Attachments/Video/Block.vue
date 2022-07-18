<template>
    <div class="video-blocked">
        <BlockIcon class="icon block" />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        BlockIcon: () => import("~icons/block.svg")
    }
};
</script>

<style lang="scss">
.video-blocked {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 35vw;
    height: 20vw;
}
</style>