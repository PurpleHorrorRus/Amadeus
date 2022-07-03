<template>
    <div class="gallery" :class="galleryClass">
        <Component 
            :is="render(attachment)"
            v-for="(attachment, index) of data"
            :key="index"
            :item="attachment"
            :index="index"
            @click.native="openMedia(index)"
        />
    </div>
</template>

<script>
import { ipcRenderer } from "electron";

import AttachmentPhoto from "~/components/Messages/Attachments/Gallery/Photo";
import AttachmentVideo from "~/components/Messages/Attachments/Gallery/Video";

import AttachmentsMixin from "~/mixins/attachments";

export default {
    mixins: [AttachmentsMixin],

    data: () => ({
        openedIndex: 0
    }),

    computed: {
        galleryClass() {
            return {
                [`grid-${this.data.length}`]: true
            };
        }
    },

    methods: {
        render(attachment) {
            switch(attachment.type) {
                case "photo": return AttachmentPhoto;
                case "video": return AttachmentVideo;
            }
        },

        openMedia(index) {
            ipcRenderer.once("closeMedia", () => {
                ipcRenderer.removeAllListeners("nextMediaRight");
                ipcRenderer.removeAllListeners("nextMediaLeft");
                return true;
            });

            if (this.data.length > 1) {
                ipcRenderer.on("nextMediaRight", () => {
                    const nextIndex = Math.min(this.openedIndex + 1, this.data.length - 1);
                    if (nextIndex > this.openedIndex) {
                        return this.sendMedia(nextIndex);
                    }
                    
                    return false;
                });

                ipcRenderer.on("nextMediaLeft", () => {
                    const prevIndex = Math.max(this.openedIndex - 1, 0);
                    if (prevIndex < this.openedIndex) {
                        return this.sendMedia(prevIndex);
                    }
                    
                    return false;
                });
            }

            this.openedIndex = index;
            ipcRenderer.send("openMedia", this.data[index]);
        },

        sendMedia(index) {
            const media = this.data[index];
            ipcRenderer.send("nextMedia", media);
            this.openedIndex = index;
            return true;
        }
    }
};
</script>

<style lang="scss">
.gallery {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    align-items: center;

    &-item {
        cursor: pointer;
    }

    &:not(.grid-1) {
        gap: 5px;
    }

    &.grid-2 {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        grid-template-areas: "item-1 "
                            "item-2";
    }


    &.grid-3 {
        grid-template-columns: 2fr 1fr;
        grid-template-rows: max-content 1fr;
        grid-template-areas: "item-1 item-2"
                            "item-1 item-3";
    }

    &.grid-4 {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: max-content 1fr;
        grid-template-areas: "item-1 item-1 item-1"
                            "item-2 item-3 item-4";
    }

    &.grid-5 {
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: max-content 1fr;
        grid-template-areas: "item-1 item-1 item-1 item-1"
                            "item-2 item-3 item-4 item-5";
    }

    &.grid-6 {
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: max-content 1fr;
        grid-template-areas: "item-1 item-1 item-1 item-1 item-1"
                            "item-2 item-3 item-4 item-5 item-6";
    }

    &.grid-7 {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: max-content 1fr 1fr;
        grid-template-areas: "item-1 item-1 item-1"
                            "item-2 item-3 item-4"
                            "item-5 item-6 item-7";
    }

    &.grid-8 {
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: 1fr 1fr;
        grid-template-areas: "item-1 item-2 item-3 item-4"
                            "item-5 item-6 item-7 item-8";
    }

    &.grid-9 {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: 1fr;
        grid-template-areas: "item-1 item-2 item-3"
                            "item-4 item-5 item-6"
                            "item-7 item-8 item-9";
    }

    &.grid-10 {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: max-content repeat(3, 1fr);
        grid-template-areas: "item-1 item-1 item-1"
                            "item-2 item-3 item-4"
                            "item-5 item-6 item-7"
                            "item-8 item-9 item-10";
    }
}
</style>