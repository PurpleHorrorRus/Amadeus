<template>
    <div id="media-page" @click.self="close">
        <div v-if="media" id="media-page-item">
            <iframe 
                v-if="media.type === 'video'"
                id="media-page-item-player" 
                :src="media.video.player" 
            />

            <img
                v-else-if="media.type === 'photo'"
                id="media-page-item-image"
                :src="media.photo.maxSize"
            >
        </div>
    </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
    layout: "empty",

    data: () => ({
        media: null
    }),

    async created() {
        this.media = await ipcRenderer.invoke("requestMedia");
    },

    mounted() {
        ipcRenderer.on("nextMedia", (_, media) => {
            this.media = media;
            return true;
        });
    },

    methods: {
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
    align-items: center;
    justify-content: center;

    background: #24242480;

    &-item {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 60%;
        height: 60%;
        max-height: 60vh;
        
        &-player {
            width: 100%;
            height: 100%;

            border: none;
        }

        &-image {
            width: auto;
            max-height: 80vh;
        }
    }
}
</style>