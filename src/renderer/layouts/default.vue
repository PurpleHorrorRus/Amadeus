<template>
    <div id="default-layout" class="layout">
        <Titlebar />
        <nuxt class="page" />
    </div>
</template>

<script>
import Titlebar from "~/components/Titlebar/Titlebar";

export default {
    components: {
        Titlebar
    }
};
</script>

<style lang="scss">
#default-layout {
    position: absolute;
    top: 0px;
    left: 0px;

    display: grid;
    grid-template-rows: 35px 1fr;
    grid-template-columns: 1fr;
    grid-template-areas: "titlebar"
                        "page";

    width: 100%;
    height: 100%;

    overflow: hidden;

    .page {
        background: var(--primary);

        overflow-y: auto;
    }
}
</style>