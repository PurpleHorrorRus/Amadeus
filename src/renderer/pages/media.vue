<template>
    <div id="media-page" @click.self="close">
        <div v-if="~media.index" id="media-page-item">
            <iframe 
                v-if="item.type === 'video'"
                id="video"
                class="media-page-item-frame"
                :src="item.video.player" 
            />

            <MediaPageStory 
                v-else-if="item.type === 'story'" 
                :story="item.story"
            />

            <img
                v-else-if="item.type === 'photo'"
                id="photo"
                class="media-page-item-frame"
                :src="item.photo.maxSize"
            >
        </div>
    </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
    components: {
        MediaPageStory: () => import("~/components/Media/Story")
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
        }
    },

    async created() {
        this.media = await ipcRenderer.invoke("requestMedia");
        console.log(this.media);
    },

    mounted() {
        ipcRenderer.on("changeMedia", (_, index) => {
            index = Math.max(this.media.index + index, 0);
            index = Math.min(index, this.media.data.length - 1);
            this.media.index = index;
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

        width: max-content;
        height: max-content;
        max-height: 60vh;

        .media-page-item-frame {
            display: flex;
            align-items: center;

            &#video, &#story {
                border: none;
            }

            &#video {
                width: 60vw;
                height: 60vh;
            }

            &#photo {
                width: auto;
                max-height: 80vh;
            }
        }
    }
}
</style>