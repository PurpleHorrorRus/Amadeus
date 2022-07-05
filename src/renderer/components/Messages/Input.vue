<template>
    <div id="message-page-input" :class="inputClass">
        <textarea 
            id="message-page-input-textarea"
            ref="textarea"
            v-model="message" 
            v-autogrow
            placeholder="Введите сообщение..."
            @keypress.enter="send"
        />

        <div id="message-page-input-send" :class="sendIconClass" @click="send">
            <SendIcon 
                v-if="!sending"
                id="message-page-input-send-icon" 
                class="icon"
                :class="sendIconClass"
            />

            <LoaderIcon
                v-else
                id="message-page-input-loader-icon"
                class="icon loader-icon spin"
            />
        </div>

        <div v-if="attachments.length > 0" id="message-page-input-attachments">
            <MessageAttachmentsGallery :attachments="attachments" />
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import fs from "fs";
import path from "path";

import { TextareaAutogrowDirective } from "vue-textarea-autogrow-directive";

export default {
    components: {
        MessageAttachmentsGallery: () => import("~/components/Messages/Input/Gallery"),
        SendIcon: () => import("~/assets/icons/send.svg")
    },

    directives: {
        autogrow: TextareaAutogrowDirective
    },

    data: () => ({
        sending: false,
        message: "",
        attachments: []
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

        sendIconClass() {
            return {
                disabled: !this.canSend
            };
        }
    },

    mounted() {
        this.$refs.textarea.focus();

        document.onpaste = event => {
            const [item] = event.clipboardData.items;

            switch (item?.kind) {
                case "file": {
                    event.preventDefault();
                    return this.addPhoto(item);
                }

                default: {
                    this.message += event.clipboardData.getData("Text");
                    break;
                }
            }
        };
    },

    beforeDestroy() {
        document.onpaste = null;
    },

    methods: {
        ...mapActions({
            sendMessage: "vk/messages/SEND"
        }),

        async send(event) {
            if (!this.canSend) {
                return false;
            }

            event.preventDefault();
            if (this.attachments.length > 0) {
                this.sending = true;
            }

            const message = this.message;
            const attachments = [...this.attachments];

            this.message = "";
            this.attachments.length = 0;

            await this.sendMessage({
                id: this.$route.params.chat,
                type: this.$route.query.type,

                attachments,
                message
            });

            this.sending = false;
            return true;
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
        }
    }
};
</script>

<style lang="scss">
#message-page-input {
    grid-area: input;

    display: grid;
    grid-template-columns: 1fr 20px;
    grid-template-rows: max-content;
    grid-template-areas: "input send";
    align-items: center;
    column-gap: 10px;

    height: 100%;

    padding: 10px 10px 10px 5px;

    &.attachments {
        display: grid;
        grid-template-columns: 1fr 20px;
        grid-template-rows: max-content max-content;
        grid-template-areas: "input send"
                            "attachments attachments";
    }

    &-textarea {
        grid-area: input;

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
        grid-area: send;

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

    &-attachments {
        grid-area: attachments;
    }
}
</style>