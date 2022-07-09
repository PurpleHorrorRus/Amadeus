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
                <Message
                    v-for="(message, index) of chat.messages"
                    :key="message.id + message.text"
                    :message="message"
                    :same="same(index)"
                    @action="action($event, index)"
                    @click.left.native="select(message)"
                    @click.right.native="openMenu(message, $event, true)"
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
        Message: () => import("~/components/Messages/Message"),
        MessageInput: () => import("~/components/Messages/Input"),
        MessageNotAllowed: () => import("~/components/Messages/Input/NotAllowed"),

        MessageMenu: () => import("~/components/Menu/Views/Chat")
    },

    mixins: [CoreMixin, ScrollMixin, DateMixin, MenuMixin],

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
            current: state => state.vk.messages.current,
            user: state => state.vk.user,
            song: state => state.audio.song
        }),

        chatPageClass() {
            return {
                loading: this.loading,
                player: this.song !== null
            };
        },
        
        chatPageStyle() {
            const background = this.settings.appearance.messages.background;
            
            return {
                backgroundSize: `${background.width * background.zoom}vw ${background.height * background.zoom}vh`,
                backgroundPositionX: background.x + "%",
                backgroundPositionY: background.y + "%",

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
            read: "vk/messages/READ"
        }),

        async action(name, index) {
            const message = this.chat.messages[index] || this.menu.target;
            this.closeMenu();

            switch(name) {
                case "reply": {
                    return this.$refs.input.addReply(message);
                }

                case "edit": {
                    return this.$refs.input.edit(message);
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

        same(index) {
            if (index === 0) {
                return false;
            }

            const currentMessage = this.chat.messages[index];
            const previousMessage = this.chat.messages[index - 1];
            return currentMessage.from_id === previousMessage.from_id;
        },

        select(message) {
            message.selected = !message.selected;
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
            if (this.$refs.input?.editing.enable) return this.$refs.input.clearEditing();
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

        background-size: auto;
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