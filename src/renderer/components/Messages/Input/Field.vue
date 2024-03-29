<template>
    <div id="message-page-input-field">
        <textarea
            id="message-page-input-field-textarea"
            ref="textarea"
            v-model="message"
            v-autosize
            :placeholder="$strings.CHAT.INPUT"
            :disabled="disabled"
            @keypress.enter="send"
            @keydown.up="hotkeyEdit"
            @click.right="openMenu($event)"
        />

        <InputStickers v-if="stickersExist" />
        <InputRecorder />

        <InputFieldSend
            :loading="$parent.sending"
            :canSend="canSend"
            @send="send"
        />

        <ContextMenu v-if="menu.show" :menu="menu" />
    </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";
import lodash from "lodash";
import TextareaAutosizeDirective from "./Field/Autosize";

import AttachmentsMixin from "~/mixins/message/attachments";
import ActionsMixin from "~/mixins/message/actions";
import DateMixin from "~/mixins/date";
import MenuMixin from "~/mixins/menu";

import Message from "~/instances/Messages/Message";

export default {
    components: {
        InputStickers: () => import("~/components/Messages/Input/Stickers.vue"),
        InputRecorder: () => import("~/components/Messages/Input/Recorder.vue"),
        InputFieldSend: () => import("~/components/Messages/Input/Field/Send.vue")
    },

    directives: {
        autosize: TextareaAutosizeDirective
    },

    mixins: [AttachmentsMixin, ActionsMixin, DateMixin, MenuMixin],

    props: {
        disabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data: () => ({
        message: "" as string,
        typingThrottle: null
    }),

    computed: {
        ...mapState({
            current: (state: any) => state.vk.messages.current,
            cache: (state: any) => state.vk.messages.cache,
            input: (state: any) => state.input,
            modal: (state: any) => state.modal,
            stickersExist: (state: any) => state.vk.messages.stickers.stickersExist
        }),

        canSend() {
            return this.message.trim().length > 0
                || this.input.attachments.length > 0
                || this.input.fwd_messages.length > 0;
        },

        canEdit() {
            return this.message.length === 0
                && !this.input.editing.enable
                && this.input.attachments.length === 0;
        }
    },

    watch: {
        "input.editing.enable": {
            handler: function(enable) {
                this.message = enable
                    ? this.input.editing.message.text
                    : "";
            }
        },

        "input.message": {
            handler: function(message) {
                this.message = message;
            }
        },

        message: {
            handler: function(message) {
                this.setMessage(message);
                this.$refs.textarea.resize();

                if (message.length === 0 || this.input.editing.enable) {
                    return false;
                }

                return this.typingThrottle();
            }
        }
    },

    mounted() {
        this.typingThrottle = lodash.throttle(() => {
            this.sendTyping({
                id: this.current?.id,
                type: "typing"
            });
        }, 6 * 1000);

        document.onpaste = event => this.onPaste(event);
        window.addEventListener("focus", this.focus);
        window.addEventListener("keypress", this.focus);
        this.focus({ type: "focus" });
    },

    beforeDestroy() {
        this.setMessage("");
        document.onpaste = null;
        window.removeEventListener("focus", this.focus);
        window.removeEventListener("keypress", this.focus);
    },

    methods: {
        ...mapActions({
            sendTyping: "vk/messages/SEND_TYPING",

            setMessage: "input/SET_MESSAGE",
            addPhotoClipboard: "input/ADD_PHOTO_CLIPBOARD"
        }),

        send(event) {
            if (!this.canSend) {
                return false;
            }

            if (!event || (event && !event.shiftKey)) {
                if (event) {
                    event.preventDefault();
                }

                const message = this.message;
                this.message = "";
                return this.$parent.send(message);
            }

            return false;
        },

        focus(event) {
            if (this.modal.show) {
                return false;
            }

            if (event.type === "keypress" || event.type === "focus") {
                this.$refs.textarea.focus();
            }
        },

        onPaste(event) {
            const item = event.clipboardData.items[0];

            switch (item?.kind) {
                case "file": {
                    event.preventDefault();
                    return this.addPhotoClipboard(item);
                }

                default: break;
            }
        },

        hotkeyEdit(event) {
            if (!this.canEdit) {
                return false;
            }

            if (this.message.length === 0) {
                event.preventDefault();
            }

            const messages: Message[] = this.cache[this.current.id].messages;
            for (const message of messages) {
                if (this.dateDiff(message).hours() >= 24) {
                    return false;
                }

                if (
                    message.out
                    && !message.action
                    && !message.deleted
                    && !this.checkBlockedAttachments(message)
                ) {
                    return this.action("edit", message);
                }
            }

            return false;
        },

        async setMenuItems() {
            const paste = await navigator.clipboard.readText();
            const selection = this.message.substring(
                this.$refs.textarea.selectionStart,
                this.$refs.textarea.selectionEnd
            );

            this.menu.items.push({
                id: "paste",
                label: this.$strings.CHAT.INPUT_ACTIONS.PASTE,
                show: paste && typeof paste === "string",
                function: () => document.execCommand("paste")
            });

            this.menu.items.push({
                id: "copy",
                label: this.$strings.CHAT.INPUT_ACTIONS.COPY,
                show: selection.length > 0,
                function: () => document.execCommand("copy")
            });

            this.menu.items.push({
                id: "cut",
                label: this.$strings.CHAT.INPUT_ACTIONS.CUT,
                show: selection.length > 0,
                function: () => document.execCommand("cut")
            });
        }
    }
};
</script>

<style lang="scss">
#message-page-input-field {
    display: grid;
    grid-template-columns: 1fr repeat(3, max-content);
    align-items: center;
    column-gap: 10px;

    width: 100%;

    &-textarea {
        display: flex;
        align-items: center;

        width: 100%;
        height: 35px;
        min-height: 35px;
        max-height: 200px;

        padding: 7px;

        background-color: var(--field);
        border: none;
        border-radius: 4px;
        overflow: hidden;

        font-size: 14px;
        line-height: 20px;

        outline: none;
        resize: none;

        &::placeholder {
            width: auto;
            max-width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
}
</style>