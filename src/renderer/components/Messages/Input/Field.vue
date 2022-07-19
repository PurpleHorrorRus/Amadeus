<template>
    <div id="message-page-input-field">
        <textarea 
            id="message-page-input-field-textarea"
            ref="textarea"
            v-model="message" 
            v-autogrow
            placeholder="Введите сообщение..."
            :disabled="disabled"
            @keypress.enter="send"
            @keydown.up="hotkeyEdit"
        />

        <InputFieldSend 
            :loading="$parent.sending"
            :canSend="canSend"
            @send="send"
        />
    </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";
import lodash from "lodash";
import { TextareaAutogrowDirective } from "vue-textarea-autogrow-directive";

import AttachmentsMixin from "~/mixins/attachments";
import ActionsMixin from "~/mixins/actions";
import DateMixin from "~/mixins/date";

import Message from "~/instances/Messages/Message";

export default {
    components: {
        InputFieldSend: () => import("~/components/Messages/Input/Field/Send")
    },

    directives: {
        autogrow: TextareaAutogrowDirective
    },

    mixins: [AttachmentsMixin, ActionsMixin, DateMixin],
    
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
            modal: (state: any) => state.modal
        }),

        canSend() {
            return this.message.length > 0
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
        
        message: {
            handler: function(message) {
                if (message.length === 0 || this.input.editing.enable) {
                    return false;
                }

                return this.typingThrottle();
            }
        }
    },

    mounted() {
        this.typingThrottle = lodash.throttle(() => {
            this.sendTyping(this.current.id);
        }, 6 * 1000);

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
            sendTyping: "vk/messages/SEND_TYPING",

            addPhoto: "input/ADD_PHOTO"
        }),

        send(event) {
            event?.preventDefault();

            if (!this.canSend) {
                return false;
            }

            const message = this.message;
            this.message = "";
            return this.$parent.send(message);
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
                    return this.addPhoto(item);
                }

                default: 
            }
        },

        hotkeyEdit() {
            if (!this.canEdit) {
                return false;
            }

            const messages: Message[] = this.cache[this.current.id].messages;
            for (let i = messages.length - 1; i > 0; i--) {
                const message = messages[i];

                if (this.dateDiff(message).hours() >= 24) {
                    return false;
                }

                if (message.out && !this.checkBlockedAttachments(message)) {
                    return this.action("edit", message);
                }
            }

            return false;
        }
    }
};
</script>

<style lang="scss">
#message-page-input-field {
    display: flex;
    align-items: center;
    flex-direction: row;
    column-gap: 10px;
    
    width: 100%;

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
}
</style>