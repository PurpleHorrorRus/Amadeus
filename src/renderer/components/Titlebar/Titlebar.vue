<template>
    <div id="titlebar">
        <span id="titlebar-title" v-text="'VKGram'" />

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

<script>
import { ipcRenderer } from "electron";

export default {
    components: {
        AppButton: () => import("~/components/Titlebar/AppButton")
    },

    data: () => ({
        AppButtons: [{
            icon: () => import("~/assets/icons/minus.svg"),
            event: "minimize"
        }, {
            icon: () => import("~/assets/icons/square.svg"),
            event: "maximize",
            class: "maximize"
        }, {
            icon: () => import("~/assets/icons/x.svg"),
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

    background: #131313;
    border-bottom: 1px solid #343434;

    z-index: 999;

    &-title {
        padding-left: 20px;

        font-size: 11px;
        font-weight: bold;
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