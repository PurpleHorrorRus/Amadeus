<template>
    <div id="message-page-input" class="nowrap" :class="inputClass">
        <InputEdit v-if="input.editing.enable" />
        <InputField />
        <InputAttachments v-if="showAttachments" />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import ModalMixin from "~/mixins/modal";

export default {
    components: {
        InputEdit: () => import("~/components/Messages/Input/Edit"),
        InputField: () => import("~/components/Messages/Input/Field"),
        InputAttachments: () => import("~/components/Messages/Input/Attachments")
    },

    mixins: [ModalMixin],

    data: () => ({
        sending: false
    }),

    computed: {
        ...mapState({
            paths: state => state.config.paths,
            current: state => state.vk.messages.current,
            input: state => state.input
        }),

        inputClass() {
            return {
                attachments: this.showAttachments
            };
        },

        showAttachments() {
            return this.input.attachments.length > 0
                || this.input.fwd_messages.length > 0
                || this.input.reply;
        }
    },

    methods: {
        ...mapActions({
            sendMessage: "vk/messages/SEND",
            editMessage: "vk/messages/EDIT",

            addReply: "input/ADD_REPLY",
            removeReply: "input/REMOVE_REPLY",

            removeForwad: "input/REMOVE_FORWARD",

            edit: "input/EDIT",
            clearEdit: "input/CLEAR_EDIT",

            clearInput: "input/CLEAR"
        }),

        async send(message) {
            if (this.input.attachments.length > 0) {
                this.sending = true;
            }

            const attachments = [...this.input.attachments];
            const reply_message = this.input.reply ? { ...this.input.reply } : undefined;
            const forward_messages = [...this.input.fwd_messages];
            this.clearInput();

            const params = {
                peer_id: this.current.information.peer.id,
                type: this.$route.query.type,

                attachments,
                text: message,
                reply_message,
                forward_messages
            };

            if (this.input.editing.enable) {
                const edited = {
                    ...this.input.editing.message,
                    text: params.text,
                    attachments: params.attachments,
                    reply_message: params.reply_message
                };

                this.clearEdit();
                await this.editMessage(edited);
            } else await this.sendMessage(params);

            this.sending = false;
            return true;
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

    padding: 10px 10px 10px 5px;
}
</style>