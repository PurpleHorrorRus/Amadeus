<template>
    <div id="chat-page">
        <MessagesHeader v-if="current" :conversation="current" />

        <div 
            id="chat-page-messages" 
            ref="messages" 
            :class="chatPageClass"
            :style="chatPageStyle"
        >
            <Skeleton 
                v-if="loadMore"
                id="skeleton-messages"
                :count="5"
                :width="'100%'"
                :height="'40px'" 
            />

            <div v-if="!loading" id="chat-page-messages-list">
                <MessagesChunk
                    v-for="(chunk, index) of chunks"
                    :key="index" 
                    :chunk="chunk"
                />

                <ContextMenu v-if="menu.show" :position="menu.position">
                    <MessageMenu :message="menu.target" />
                </ContextMenu>
            </div>

            <LoaderIcon v-else class="icon loader-icon spin" />
        </div>

        <MessageInput v-if="canWrite" ref="input" />
        <MessageNotAllowed v-else-if="showBlocked" />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import CoreMixin from "~/mixins/core";
import ScrollMixin from "~/mixins/scroll";
import DateMixin from "~/mixins/date";
import MenuMixin from "~/mixins/menu";

import common from "~/plugins/common";

export default {
    components: {
        MessagesHeader: () => import("~/components/Messages/Header"),
        MessagesChunk: () => import("~/components/Messages/Chunk"),
        MessageInput: () => import("~/components/Messages/Input"),
        MessageNotAllowed: () => import("~/components/Messages/Input/NotAllowed"),

        MessageMenu: () => import("~/components/Menu/Views/Chat")
    },

    mixins: [CoreMixin, ScrollMixin, DateMixin, MenuMixin],

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
        loading: true,
        loadMore: false,

        id: 0,
        type: "user",

        percentToRead: 80,

        chat: {
            count: 0,
            messages: []
        }
    }),

    computed: {
        ...mapState({
            extended: state => state.extendedView,
            current: state => state.vk.messages.current,
            user: state => state.vk.user,
            song: state => state.audio.song,
            input: state => state.input
        }),

        chatPageClass() {
            return {
                extended: this.extended,
                loading: this.loading,
                chat: this.chat.isChat,
                player: this.song !== null
            };
        },
        
        chatPageStyle() {
            const background = this.settings.appearance.messages.background;
            
            return {
                backgroundSize: `${background.width * background.zoom}vw ${background.height * background.zoom}vh`,
                backgroundPositionX: background.x + "vw",
                backgroundPositionY: -background.y + "vh",

                backgroundImage: background.base64 
                    // eslint-disable-next-line max-len
                    ? `url("${background.base64}")`
                    : "var(--primary)"
            };
        },

        canWrite() {
            return !this.chat.search
                && this.current?.information.can_write.allowed;
        },

        showBlocked() {
            return !this.loading
                && !this.canWrite;
        },

        chunks() {
            const chunks = [];
            let current = [];

            for (const message of this.chat.messages) {
                if (current.length === 0) {
                    current.push(message);
                    continue;
                } 
                
                if (current[current.length - 1].from_id !== message.from_id) {
                    chunks.push(current);
                    current = [message];
                } else current.push(message);
            }

            if (current.length > 0) {
                chunks.push(current);
            }

            return chunks;
        },

        canScroll() {
            return this.chat.messages.length < this.chat.count;
        },

        itsMe() {
            return this.user.id === this.id;
        }
    },

    watch: {
        loading: {
            handler: function() {
                this.$nextTick(async () => {
                    this.scrollToBottom();
                    await common.wait(80);
                    this.scrollToBottom();
                });
            }
        },

        scrollPercent: {
            handler: function(percent) {
                if (percent > this.percentToRead && this.chat.conversation.information.unread_count > 0) {
                    this.readOnBottom();
                }
            }
        },

        "settings.vk.disable_read": {
            handler: function(disable_read) {
                if (!disable_read) {
                    this.readOnBottom();
                }
            }
        },

        "chat.messages": {
            handler: function() {
                if (this.scrollPercent > this.percentToRead) {
                    this.$nextTick(() => this.scrollToBottom());
                }
            }
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

        this.loading = false;

        window.addEventListener("focus", this.readOnBottom);
        document.addEventListener("keydown", this.exit);

        this.registerScroll(this.$refs.messages, async () => {
            if (this.loadMore) {
                return false;
            }

            this.loadMore = true;
            await this.append(this.id);
            this.loadMore = false;
        }, percent => percent <= 30);
    },

    beforeDestroy() {
        this.clearInput();

        window.removeEventListener("focus", this.readOnBottom);
        document.removeEventListener("keydown", this.exit);

        if (!this.loading) {
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
            read: "vk/messages/READ",

            addReply: "input/ADD_REPLY",
            edit: "input/EDIT",
            clearEdit: "input/CLEAR_EDIT",
            clearInput: "input/CLEAR"
        }),

        async action(name, message) {
            message = message || this.menu.target;
            this.closeMenu();

            switch(name) {
                case "reply": {
                    return this.addReply(message);
                }

                case "edit": {
                    return this.edit(message);
                }

                case "delete": {
                    return await this.delete({ message });
                }

                case "delete-for-all": {
                    return await this.delete({ 
                        delete_for_all: true,
                        message 
                    });
                }

                case "important": {
                    return await this.markImportant(message);
                }
            }
        },

        select(message) {
            message.selected = !message.selected;
            return message;
        },

        readOnBottom() {
            if (this.scrollPercent < this.percentToRead) {
                return false;
            }

            return this.read(this.chat);
        },

        scrollToBottom() {
            if (!this.$refs.messages) return false;
            this.$refs.messages.scrollTop = this.$refs.messages?.scrollHeight;
            this.readOnBottom();
            return true;
        },

        exit(event) {
            if (event.code !== "Escape") return false;
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
                        "messages"
                        "input";
    
    width: 100%;
    height: 100%;

    &-messages {
        grid-area: messages;

        position: relative;

        background-repeat: no-repeat;

        overflow-x: hidden;
        overflow-y: overlay;

        &::-webkit-scrollbar {
            width: 0px;
        }

        &:hover {
            &::-webkit-scrollbar {
                width: 4px;
            }
        }

        &.loading {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        &:not(.extended) {
            background-size: cover !important;
        }

        &.chat {
            .message {
                &:not(.last) {
                    &.out {
                        padding-right: 48px;
                    }

                    &:not(.out) {
                        padding-left: 47px;
                    }
                }
            }
        }

        &-list {
            grid-area: list;

            display: flex;
            flex-direction: column;
            row-gap: 10px;

            padding: 10px;
        }
    }
}
</style>