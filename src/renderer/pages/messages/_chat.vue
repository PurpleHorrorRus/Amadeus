<template>
    <div
        id="chat-page"
        :class="chatClass"
        @dragenter.prevent="onDragEnter"
        @dragover.prevent
    >
        <MessagesHeader v-if="current" :conversation="current" />

        <div id="chat-page-container">
            <div id="chat-page-container-background" :style="backgroundStyle" />
            <MessagesViewport v-if="!first" />
            <LoaderIcon v-else class="icon loader-icon spin" />
        </div>

        <MessageInput v-if="canWrite" ref="input" />
        <MessageNotAllowed v-else-if="showBlocked" />

        <Upload
            v-if="drag"
            :uploading="uploading"
            @dragleave.prevent.native="onDragLeave"
            @dragover.prevent
            @choose="uploadAttachments"
        />
    </div>
</template>

<script lang="ts">
import path from "path";
import { mapActions, mapState } from "vuex";
import Promise from "bluebird";

import { TUploadingPath } from "~/instances/Types/Attachments";

import CoreMixin from "~/mixins/core";
import DateMixin from "~/mixins/date";

const allowUpload = {
    image: [".jpg", ".jpeg", ".png"],
    video: [".mp4", ".mkv", ".avi", ".3gp", ".mpeg", ".mov", ".flv", ".wmv"]
};

const allowUploadExtensions = Object.values(allowUpload).flat(1);
const docsExclude = [".mp3", ".exe"];

export default {
    components: {
        MessagesHeader: () => import("~/components/Messages/Header.vue"),
        MessagesViewport: () => import("~/components/Messages/Viewport.vue"),

        MessageInput: () => import("~/components/Messages/Input.vue"),
        MessageNotAllowed: () => import("~/components/Messages/Input/NotAllowed.vue")
    },

    mixins: [CoreMixin, DateMixin],

    provide() {
        const provideData = {};

        Object.defineProperty(provideData, "conversation", {
            enumerable: true,
            get: () => this.chat.conversation
        });

        return {
            provideData
        };
    },

    data: () => ({
        first: true as boolean,

        id: 0 as number,
        type: "user" as string,
        opened: false as boolean,

        drag: false as boolean,
        uploading: false as boolean,

        chat: {
            count: 0,
            messages: []
        } as import("~/instances/Types/Messages").TChat
    }),

    computed: {
        ...mapState({
            background: (state: any) => state.background,
            input: (state: any) => state.input,
            modal: (state: any) => state.modal
        }),

        chatClass() {
            return {
                extended: this.extended,
                first: this.first,
                chat: this.chat.conversation?.isChat
            };
        },

        backgroundStyle() {
            const background = this.settings.appearance.messages.background;

            return {
                backgroundPositionX: background.x + "%",
                backgroundPositionY: background.y + "%",
                backgroundImage: this.background
            };
        },

        canWrite() {
            return !this.chat.search
                && !this.chat.conversation?.restricted;
        },

        showBlocked() {
            return !this.first
                && !this.canWrite;
        },

        itsMe() {
            return this.user.id === this.id;
        }
    },

    created() {
        if (!this.$route.query.redirect) {
            this.clearInput();
        }

        this.id = Number(this.$route.params.chat);
        this.type = this.$route.query.type;
    },

    async mounted() {
        const conversation = await this.getConversationCache(this.id);
        this.setCurrent(conversation);

        this.chat = await this.load({
            id: this.id,
            start_message_id: Number(this.$route.query.start_message_id) || undefined
        });

        document.addEventListener("keydown", this.exit);
        this.first = false;
    },

    beforeDestroy() {
        document.removeEventListener("keydown", this.exit);

        if (!this.first) {
            this.unselectAll();

            !this.chat.search
                ? this.flush(this.current)
                : this.clear(this.current);
        }

        this.setCurrent(null);
    },

    methods: {
        ...mapActions({
            getConversationCache: "vk/conversations/GET_CONVERSATION_CACHE",

            load: "vk/messages/LOAD",
            append: "vk/messages/APPEND",
            flush: "vk/messages/FLUSH",
            clear: "vk/messages/CLEAR",
            delete: "vk/messages/DELETE",
            setCurrent: "vk/messages/SET_CURRENT",
            unselectAll: "vk/messages/UNSELECT_ALL",

            uploadVideo: "vk/uploader/UPLOAD_VIDEO",
            uploadDoc: "vk/uploader/UPLOAD_DOC",

            addPhotoPath: "input/ADD_PHOTO_PATH",
            edit: "input/EDIT",
            clearEdit: "input/CLEAR_EDIT",
            clearInput: "input/CLEAR",

            close: "modal/CLOSE"
        }),

        turnProfile() {
            this.opened = !this.opened;
        },

        exit(event) {
            if (event.code !== "Escape") return false;
            if (this.opened) return this.turnProfile();
            if (this.input.editing.enable) return this.clearEdit();
            if (this.modal.show) return this.close();
            this.$router.replace("/general").catch(() => (false));
            return true;
        },

        onDragEnter(event) {
            if (this.uploading || event.dataTransfer.items[0].kind === "string") {
                return false;
            }

            this.drag = true;
        },

        onDragLeave() {
            if (this.uploading) {
                return false;
            }

            this.drag = false;
        },

        async uploadAttachments(files) {
            if (files?.length === 0) {
                return false;
            }

            this.uploading = true;

            const payload: TUploadingPath[] = [...files].filter(file => {
                const extension = path.extname(file);
                return allowUploadExtensions.includes(extension)
                    || !docsExclude.includes(extension);
            }).map(file => ({
                extension: path.extname(file),
                path: file
            }));

            await Promise.each(payload, async file => {
                if (allowUpload.image.includes(file.extension)) {
                    return await this.addPhotoPath({
                        file: file.path,
                        temp: false
                    });
                }

                if (allowUpload.video.includes(file.extension)) {
                    return await this.uploadVideo(file.path);
                }

                return await this.uploadDoc(file.path);
            });

            this.uploading = false;
            this.drag = false;
        }
    }
};
</script>

<style lang="scss">
#chat-page {
    grid-area: page;

    position: relative;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 45px 1fr auto;
    grid-template-areas: "header"
                        "container"
                        "input";

    overflow: hidden;

    &.first {
        #chat-page-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    &-container {
        grid-area: container;

        width: 100%;
        height: 100%;

        background-size: cover;
        background-repeat: no-repeat;

        z-index: 0;

        &-background {
            position: absolute;
            top: 0px; left: 0px;

            width: 100%;
            height: 100%;

            background-size: cover;
            background-repeat: no-repeat;
        }
    }

    .upload {
        position: absolute;
        top: 0px; left: 0px;
        width: 100%; height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        background: #2c2c2cb6;

        z-index: 10000;

        pointer-events: all;
    }
}
</style>