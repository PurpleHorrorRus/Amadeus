<template>
    <div id="chat-page" :class="chatClass">
        <MessagesHeader v-if="current" :conversation="current" />

        <div id="chat-page-container" :style="chatViewportStyle">
            <MessagesViewport v-if="!first" :chat="chat" />
            <LoaderIcon v-else class="icon loader-icon spin" />
        </div>

        <MessageInput v-if="canWrite" ref="input" />
        <MessageNotAllowed v-else-if="showBlocked" />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import CoreMixin from "~/mixins/core";
import DateMixin from "~/mixins/date";

export default {
    components: {
        MessagesHeader: () => import("~/components/Messages/Header"),
        MessagesViewport: () => import("~/components/Messages/Viewport"),
        
        MessageInput: () => import("~/components/Messages/Input"),
        MessageNotAllowed: () => import("~/components/Messages/Input/NotAllowed")
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
        first: true,

        id: 0,
        type: "user",
        opened: false,

        chat: {
            count: 0,
            messages: []
        }
    }),

    computed: {
        ...mapState({
            background: state => state.background,
            input: state => state.input
        }),

        chatClass() {
            return {
                extended: this.extended,
                first: this.first,
                chat: this.chat.conversation?.isChat
            };
        },

        chatViewportStyle() {
            const background = this.settings.appearance.messages.background;
            
            return {
                backgroundSize: `${background.width * background.zoom}vw ${background.height * background.zoom}vh`,
                backgroundPositionX: -background.x + "vw",
                backgroundPositionY: background.y + "vh",

                backgroundImage: this.background 
                    // eslint-disable-next-line max-len
                    ? `url("${this.background}")`
                    : "var(--primary)"
            };
        },

        canWrite() {
            return !this.chat.search
                && this.current?.information.can_write.allowed;
        },

        showBlocked() {
            return !this.first
                && !this.canWrite;
        },

        itsMe() {
            return this.user.id === this.id;
        }
    },

    async created() {
        this.id = Number(this.$route.params.chat);
        this.type = this.$route.query.type;
        this.setCurrent(await this.getConversationCache(this.id));
    },

    async mounted() {
        this.chat = await this.load({
            id: this.id,
            start_message_id: Number(this.$route.query.start_message_id) || undefined
        });

        document.addEventListener("keydown", this.exit);
        this.first = false;
    },

    beforeDestroy() {
        this.clearInput();
        document.removeEventListener("keydown", this.exit);

        if (!this.first) {
            return !this.chat.search
                ? this.flush(this.current) 
                : this.clear(this.current);
        } 
    },

    destroyed() {
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
            markImportant: "vk/messages/MARK_IMPORTANT",

            addReply: "input/ADD_REPLY",
            edit: "input/EDIT",
            clearEdit: "input/CLEAR_EDIT",
            clearInput: "input/CLEAR"
        }),

        turnProfile() {
            this.opened = !this.opened;
        },

        select(message) {
            message.selected = !message.selected;
            return message;
        },

        exit(event) {
            if (event.code !== "Escape") return false;
            if (this.opened) return this.turnProfile();
            if (this.input.editing.enable) return this.clearEdit();
            this.$router.replace("/general").catch(() => {});
            return true;
        }
    }
};
</script>

<style lang="scss">
#chat-page {
    grid-area: page;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 40px 1fr max-content;
    grid-template-areas: "header"
                        "container"
                        "input";
                
    &.first {
        #chat-page-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    
    &:not(.extended) {
        #chat-page-container {
            background-size: cover !important;
            background-position: center !important;
        }
    }

    &-container {
        grid-area: container;

        width: 100%;
        height: 100%;

        background-repeat: no-repeat;
    }
}
</style>