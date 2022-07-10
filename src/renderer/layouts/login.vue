<template>
    <div id="login-layout" class="layout">
        <Titlebar />
        <nuxt class="page" />
    </div>
</template>

<script>
export default {
    components: {
        Titlebar: () => import("~/components/Titlebar/Titlebar")
    }
};
</script>

<style lang="scss">
#login-layout {
    position: absolute;
    inset: 0px;
    width: 100%; height: 100%;

    display: grid;
    grid-template-rows: 35px 1fr;
    grid-template-areas: "titlebar"
                        "page";
}
</style>