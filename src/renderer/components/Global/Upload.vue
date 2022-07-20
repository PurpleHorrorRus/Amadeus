<template>
    <div 
        class="upload" 
        :class="uploadClass" 
        @click="open" 
        @drop.prevent.stop="open" 
        @dragenter.prevent="onDragEnter"
        @dragleave.prevent="drag = false"
    >
        <UploadIcon v-if="!uploading" class="icon vkgram" />
        <LoaderIcon v-else class="icon loader-icon spin" />

        <span class="upload-label" v-text="text" />
    </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";

export default {
    components: {
        UploadIcon: () => import("~icons/upload.svg")
    },

    props: {
        uploading: {
            type: Boolean,
            required: false,
            default: false
        },

        properties: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },

    data: () => ({
        drag: false as boolean
    }),

    computed: {
        uploadClass() {
            return {
                uploading: this.uploading,
                drag: !this.uploading && this.drag
            };
        },

        text() {
            return !this.uploading
                ? "Выберите или перетащите файл для загрузки"
                : "Загрузка вложений...";
        }
    },

    methods: {
        onDragEnter(event) {
            if (this.uploading || event.dataTransfer.items[0].kind === "string") {
                return false;
            }

            this.drag = true;
        },

        async open(event) {
            if (this.uploading || event.dataTransfer.items[0].kind === "string") {
                return false;
            }

            if (event.dataTransfer) {
                return this.$emit("choose", event.dataTransfer.files);
            }

            const filePaths = await ipcRenderer.invoke("select", this.properties);
            return filePaths
                ? this.$emit("choose", filePaths)
                : false;
        }
    }
};
</script>

<style lang="scss">
.upload {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    column-gap: 10px;

    width: 100%;
    height: 100%;

    border: 2px dashed var(--border);

    * {
        pointer-events: none;
    }

    .icon path {
        transition: none !important;
    }

    &:not(.uploading) {
        cursor: pointer;

        &:hover, &.drag {
            border: 2px dashed var(--secondary);

            .icon path {
                fill: var(--secondary);
            }

            span {
                color: var(--secondary);
            }
        }
    }

    &.uploading {
        cursor: not-allowed;
    }
}
</style>