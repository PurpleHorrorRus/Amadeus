<template>
    <div id="media-page" @click.self="close">
        <MediaPageItem v-if="~media.index" :item="item" />
        <MediaPageNavigation />
        <MediaPageBottom />
    </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";

export default {
    components: {
        MediaPageItem: () => import("~/components/Media/Item.vue"),
        MediaPageNavigation: () => import("~/components/Media/Navigation.vue"),
        MediaPageBottom: () => import("~/components/Media/Bottom.vue")
    },

    layout: "empty",

    data: () => ({
        media: {
            data: [],
            index: -1
        }
    }),

    computed: {
        item() {
            return this.media.data[this.media.index];
        },

        currentText() {
            return `${this.media.index + 1} / ${this.media.data.length}`;
        }
    },

    async created() {
        this.media = await ipcRenderer.invoke("requestMedia");
    },

    mounted() {
        ipcRenderer.on("changeMedia", (_, index) => {
            return this.changeMedia(index);
        });
    },

    methods: {
        changeMedia(index) {
            index = Math.max(this.media.index + index, 0);
            index = Math.min(index, this.media.data.length - 1);
            this.media.index = index;
        },

        close() {
            ipcRenderer.send("close");
        }
    }
};
</script>

<style lang="scss">
#media-page {
    position: absolute;
    top: 0px; left: 0px;
    width: 100%; height: 100%;

    display: flex;
    flex-direction: column;
    row-gap: 10px;
    align-items: center;
    justify-content: center;

    background: #24242480;

    pointer-events: all;
}
</style>