<template>
    <div id="login-layout" class="layout">
        <Titlebar />
        <nuxt class="page" />
    </div>
</template>

<script lang="ts">
import CoreMixin from "~/mixins/core";
import AppearanceMixin from "~/mixins/appearance";

export default {
    components: {
        Titlebar: () => import("~/components/Titlebar/Titlebar.vue")
    },

    mixins: [CoreMixin, AppearanceMixin],

    created() {
        this.setTheme(this.settings.appearance.theme);
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