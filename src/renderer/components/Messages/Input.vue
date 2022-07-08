<template>
    <div id="message-page-input" class="nowrap" :class="inputClass">
        <div v-if="editing.enable" id="message-page-input-edit">
            <span 
                id="message-page-input-edit-label"
                class="small-text"
                v-text="'Редактирование сообщения'" 
            />

            <XIcon 
                class="icon clickable" 
                @click="clearEditing" 
            />
        </div>

        <div id="message-page-input-field">
            <textarea 
                id="message-page-input-field-textarea"
                ref="textarea"
                v-model="message" 
                v-autogrow
                placeholder="Введите сообщение..."
                @keypress.enter="send"
                @keydown.up="hotkeyEdit"
            />

            <div id="message-page-input-field-send" :class="sendIconClass" @click="send">
                <SendIcon 
                    v-if="!sending"
                    id="message-page-input-field-send-icon" 
                    class="icon"
                    :class="sendIconClass"
                />

                <LoaderIcon
                    v-else
                    id="message-page-input-loader-icon"
                    class="icon loader-icon spin"
                />
            </div>
        </div>

        <MessageReply 
            v-if="reply" 
            :message="reply" 
            @click.native="removeReply"
        />

        <div v-if="attachments.length > 0" id="message-page-input-attachments">
            <MessageAttachmentsGallery :attachments="attachments" />
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import fs from "fs";
import path from "path";
import { findLastIndex } from "lodash";

import { TextareaAutogrowDirective } from "vue-textarea-autogrow-directive";

export default {
    components: {
        MessageAttachmentsGallery: () => import("~/components/Messages/Input/Gallery"),
        MessageReply: () => import("~/components/Messages/Reply"),
        SendIcon: () => import("~/assets/icons/send.svg"),
        XIcon: () => import("~/assets/icons/x.svg")
    },

    directives: {
        autogrow: TextareaAutogrowDirective
    },

    data: () => ({
        sending: false,
        message: "",
        reply: null,
        attachments: [],

        editing: {
            enable: false,
            message: null
        }
    }),

    computed: {
        ...mapState({
            paths: state => state.config.paths,
            current: state => state.vk.messages.current
        }),

        inputClass() {
            return {
                attachments: this.attachments.length > 0
            };
        },

        canSend() {
            return this.message.length > 0
                || this.attachments.length > 0;
        },

        canEdit() {
            return !this.editing.enable
                && this.message.length === 0
                && this.attachments.length === 0;
        },

        sendIconClass() {
            return {
                disabled: !this.canSend
            };
        }
    },

    mounted() {
        document.onpaste = event => this.onPaste(event);
        window.addEventListener("focus", this.focus);
        window.addEventListener("keypress", this.focus);
        this.focus({ type: "focus" });
    },

    beforeDestroy() {
        document.onpaste = null;
        window.removeEventListener("focus", this.focus);
        window.removeEventListener("keypress", this.focus);
    },

    methods: {
        ...mapActions({
            sendMessage: "vk/messages/SEND",
            editMessage: "vk/messages/EDIT"
        }),

        async send(event) {
            if (!this.canSend) {
                return false;
            }

            event.preventDefault();
            if (this.attachments.length > 0) {
                this.sending = true;
            }

            const text = this.message;
            const attachments = [...this.attachments];
            const reply_message = this.reply ? { ...this.reply } : undefined;

            this.message = "";
            this.attachments.length = 0;
            this.reply = null;

            const params = {
                peer_id: this.current.information.peer.id,
                type: this.$route.query.type,

                attachments,
                text,
                reply_message
            };

            if (this.editing.enable) {
                this.editing.message.text = params.text;
                this.editing.message.attachments = params.attachments;
                this.editing.message.reply_message = params.reply_message;
            }

            !this.editing.enable
                ? await this.sendMessage(params) 
                : await this.editMessage(this.editing.message);
        
            if (this.editing.enable) {
                this.clearEditing();
            }

            this.sending = false;
            return true;
        },

        onPaste(event) {
            const [item] = event.clipboardData.items;

            switch (item?.kind) {
                case "file": {
                    event.preventDefault();
                    return this.addPhoto(item);
                }

                default: {
                    return;
                }
            }
        },

        async addPhoto(item) {
            if (this.attachments.length === 10) {
                return false;
            }

            const blob = item.getAsFile();

            const filename = Date.now() + ".jpg";
            const savePath = path.resolve(this.paths.temp, filename);

            // eslint-disable-next-line no-undef
            const buffer = Buffer.from(await blob.arrayBuffer());
            fs.writeFileSync(savePath, buffer, "binary");
            
            this.attachments.push({
                type: "photo",
                filename,
                path: savePath,

                photo: {
                    id: Date.now(),
                    sizes: [{
                        width: 1, height: 1,

                        url: await new Promise(resolve => {
                            const reader = new FileReader();
                            reader.onload = event => resolve(event.target.result);
                            reader.readAsDataURL(blob);
                        })
                    }]
                }
            });

            return true;
        },

        hotkeyEdit() {
            if (!this.canEdit) {
                return false;
            }

            const latestOutMessageIndex = findLastIndex(this.$parent.chat.messages, message => {
                const firstAttachment = message.attachments[0];
                return message.out
                    && (firstAttachment?.type !== "sticker" 
                    && firstAttachment?.type !== "graffiti"
                    && firstAttachment?.type !== "audio_message");
            });

            return ~latestOutMessageIndex
                ? this.$parent.action("edit", latestOutMessageIndex)
                : false;
        },

        edit(message) {
            this.editing.enable = true;
            this.editing.message = message;

            this.message = message.text;
            this.attachments = [...message.attachments];
            this.reply = message.reply_message;

            return true;
        },

        clearEditing() {
            this.editing.enable = false;
            this.editing.message = null;

            this.message = "";
            this.attachments.length = 0;
            this.reply = null;

            return true;
        },

        addReply(message) {
            if (this.editing.enable) {
                return false;
            }
            
            this.reply = message;
            return this.reply;
        },

        removeReply() {
            this.reply = null;
            return true;
        },

        focus(event) {
            if (event.type === "keypress" || event.type === "focus") {
                this.$refs.textarea.focus();
            }
        }
    }
};
</script>

<style lang="scss">
#message-page-input {
    grid-area: input;

    display: flex;
    flex-direction: column;
    gap: 10px;

    padding: 10px 10px 10px 0px;

    &-edit {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .icon {
            width: 14px;

            stroke: var(--small-text);
        }
    }

    &-field {
        display: flex;
        align-items: center;
        flex-direction: row;
        column-gap: 10px;

        &-textarea {
            display: flex;
            align-items: center;

            width: 100%;
            max-height: 160px;
            
            padding: 7px;

            border: none;
            border-radius: 4px;

            background: var(--field);

            font-size: 14px;

            outline: none;
            resize: none;
        }
        
        &-send {
            display: flex;
            justify-content: center;
            align-items: center;

            width: 23px;
            height: 100%;
            
            cursor: pointer;

            &.disabled {
                cursor: not-allowed;
            }

            &-icon {
                width: 100%;

                path {
                    stroke: none;
                    fill: var(--secondary);
                }
            }
        }
    }

    .message-content-reply {
        cursor: pointer;
    }

    &-attachments {
        grid-area: attachments;
    }
}
</style>