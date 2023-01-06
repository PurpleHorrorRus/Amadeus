<template>
    <div id="titlebar">
        <span
            id="titlebar-title-dev"
            class="small-text"
            v-text="version"
        />

        <div id="titlebar-buttons">
            <AppButton
                v-for="button of AppButtons"
                :key="button.event"
                :icon="button.icon"
                :class="button.class"
                @click.native="send(button.event)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";

export default {
    components: {
        AppButton: () => import("./AppButton.vue")
    },

    data: () => ({
        version: "0.0.0",

        AppButtons: [{
            icon: () => import("~icons/minus.svg"),
            event: "minimize"
        },

        {
            icon: () => import("~icons/square.svg"),
            event: "maximize",
            class: "maximize"
        },

        {
            icon: () => import("~icons/x.svg"),
            event: "close",
            class: "close"
        }]
    }),

    async created() {
        this.version = this.$isDev
            ? "development mode"
            : await this.$ipc.invoke("getVersion");
    },

    methods: {
        send(event) {
            this.$ipc.send(event);
        }
    }
};
</script>

<style lang="scss">
#titlebar {
    -webkit-app-region: drag;
    grid-area: titlebar;

    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    height: 100%;

    padding: 0px 0px 0px 10px;

    background: var(--titlebar);

    z-index: 999;

    &-buttons {
        -webkit-app-region: no-drag;

        display: flex;
        justify-content: space-evenly;
        align-items: center;

        height: 100%;
    }
}
</style>