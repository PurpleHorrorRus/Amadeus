<template>
    <div
        class="upload nowrap"
        :class="uploadClass"
        @click="openFiles"
        @drop.prevent.stop="dropFiles"
        @dragenter="onDragEnter"
        @dragleave="drag = false"
        @dragover.prevent
    >
        <UploadIcon v-if="!uploading" class="icon amadeus" />
        <LoaderIcon v-else class="icon loader-icon" />

        <span class="upload-label nowrap" v-text="text" />
    </div>
</template>

<script lang="ts">
import path from "path";
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
                ? this.$strings.UPLOADER.DRAG
                : this.$strings.UPLOADER.UPLOADING;
        }
    },

    methods: {
        onDragEnter(event) {
            if (this.uploading || event.dataTransfer.items[0].kind === "string") {
                return false;
            }

            this.drag = true;
        },

        async openFiles() {
            if (this.uploading) {
                return false;
            }

            const files: Array<string> | boolean
                = await ipcRenderer.invoke("select", this.properties);

            return files
                ? this.$emit("choose", files)
                : false;
        },

        dropFiles(event) {
            if (this.uploading || event.dataTransfer.items[0]?.kind === "string") {
                return false;
            }

            let files: string[] = Array.from(event.dataTransfer.files, (file: File) => {
                return file.path;
            });

            if (this.properties.filters?.[0]?.extensions) {
                files = files.filter(file => {
                    const extension = path.extname(file).replace(".", "");
                    return this.properties.filters[0].extensions.includes(extension);
                });
            }

            if (files.length > 0) {
                return this.$emit("choose", files);
            }

            this.drag = false;
            return false;
        }
    }
};
</script>

<style lang="scss">
.upload {
    grid-area: upload;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    column-gap: 5px;

    width: 100%;
    height: 100%;

    padding: 0px 10px;

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

    &-label {
        flex: max-content 0;
    }
}
</style>