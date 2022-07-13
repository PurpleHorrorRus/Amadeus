<template>
    <div id="media-page" @click.self="close">
        <div v-if="~media.index" id="media-page-item" @click.right="openMenu">
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

            <ContextMenu v-if="menu.show" :menu="menu" />

            <div id="media-page-item-buttons">
                <MediaPageButton 
                    v-for="button of buttons"
                    :key="button.id"
                    :icon="button.icon"
                    :tooltip="button.tooltip"
                    @click.native="button.action"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { ipcRenderer } from "electron";

import MenuMixin from "~/mixins/menu";

export default {
    components: {
        MediaPageStory: () => import("~/components/Media/Story"),
        MediaPageButton: () => import("~/components/Media/Button")
    },

    mixins: [MenuMixin],

    layout: "empty",

    data: () => ({
        media: {
            data: [],
            index: -1
        },

        buttons: []
    }),

    computed: {
        item() {
            return this.media.data[this.media.index];
        }
    },

    async created() {
        this.buttons = [{
            id: "share",
            icon: () => import("~/assets/icons/reply.svg"),
            tooltip: "Поделиться",
            action: this.share
        }];

        this.media = await ipcRenderer.invoke("requestMedia");
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
        setMenuItems() {
            this.menu.items = [{
                id: "share",
                label: "Поделиться",
                function: () => {
                    this.close();
                    this.share();
                }
            },

            {
                id: "copy",
                label: "Копировать ссылку",
                function: () => this.copy("src")
            },

            {
                id: "copy",
                label: "Копировать изображение",
                function: () => this.copy("image")
            }];
        },

        close() {
            ipcRenderer.send("close");
        },

        share() {
            ipcRenderer.send("share", this.item);
        },

        copy(event) {
            ipcRenderer.send(event, this.item.photo.maxSize);
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

    &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        row-gap: 10px;

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

        &-buttons {
            display: flex;
            align-items: center;
            align-self: flex-end;
            column-gap: 10px;
        }
    }
}
</style>