<template>
    <div id="message-page-input">
        <textarea 
            id="message-page-input-textarea"
            ref="textarea"
            v-model="message" 
            v-autogrow
            placeholder="Введите сообщение..."
            @keypress.enter="send"
        />

        <div id="message-page-input-send" @click="send">
            <SendIcon 
                id="message-page-input-send-icon" 
                class="icon"
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import { TextareaAutogrowDirective } from "vue-textarea-autogrow-directive";

export default {
    components: {
        SendIcon: () => import("~/assets/icons/send.svg")
    },

    directives: {
        autogrow: TextareaAutogrowDirective
    },

    data: () => ({
        message: ""
    }),

    computed: {
        ...mapState({
            current: state => state.vk.messages.current
        })
    },

    mounted() {
        this.$refs.textarea.focus();
    },

    methods: {
        ...mapActions({
            sendMessage: "vk/messages/SEND"
        }),

        async send(event) {
            if (this.message.length === 0) {
                return false;
            }

            event.preventDefault();
            const message = this.message;

            this.message = "";
            return await this.sendMessage({
                id: this.$route.params.chat,
                type: this.$route.query.type,
                message
            });
        }
    }
};
</script>

<style lang="scss">
#message-page-input {
    grid-area: input;

    display: flex;
    align-items: center;
    column-gap: 10px;

    height: 100%;

    padding: 10px 10px 10px 5px;

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
        font-weight: 400;

        outline: none;
        resize: none;
    }
    
    &-send {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 28px;
        height: 100%;
        
        cursor: pointer;

        &-icon {
            width: 100%;

            path {
                stroke: none;
                fill: var(--secondary);
            }
        }
    }
}
</style>