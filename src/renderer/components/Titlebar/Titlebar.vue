<template>
    <div id="titlebar">
        <span id="titlebar-title" v-text="'Amadeus'" />

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

    methods: {
        send(event) {
            ipcRenderer.send(event);
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

    background: var(--titlebar);

    z-index: 999;

    &-title {
        padding-left: 20px;

        font-family: "Fira Sans";
        font-size: 12px;
    }

    &-buttons {
        -webkit-app-region: no-drag;

        display: flex;
        justify-content: space-evenly;
        align-items: center;

        height: 100%;
    }
}
</style>