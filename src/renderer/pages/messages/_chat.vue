<template>
    <div id="chat-page">
        <MessagesHeader :conversation="conversation" />

        <div id="chat-page-messages" ref="messages" :class="chatPageClass">
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
                    :key="message.id"
                    :message="message"
                    :same="same(index)"
                />
            </div>

            <LoaderIcon v-else class="icon loader-icon spin" />
        </div>

        <MessageInput ref="input" />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import ScrollMixin from "~/mixins/scroll";

import common from "~/plugins/common";

export default {
    components: {
        MessagesHeader: () => import("~/components/Messages/Header"),
        Message: () => import("~/components/Messages/Message"),
        MessageInput: () => import("~/components/Messages/Input")
    },

    mixins: [ScrollMixin],

    data: () => ({
        loading: true,
        loadMore: false,

        id: 0,
        type: "user",

        autoScroll: false,

        chat: {
            count: 0,
            messages: []
        }
    }),

    computed: {
        ...mapState({
            conversations: state => state.vk.conversations.list
        }),

        chatPageClass() {
            return {
                loading: this.loading
            };
        },
    
        conversation() {
            return this.conversations.find(conversation => {
                return conversation.profile.id === this.id;
            });
        },

        canLoadMore() {
            return this.chat.messages.length < this.chat.count;
        }
    },

    watch: {
        loading: {
            handler: function() {
                this.$nextTick(async () => {
                    this.registerScroll(this.$refs.messages);

                    this.scrollToBottom();
                    await common.wait(80);
                    this.scrollToBottom();
                });
            }
        },

        scrollPercent: {
            handler: async function(scrollPercent) {
                this.autoScroll = scrollPercent >= 80;

                if (this.canLoadMore && !this.loadMore && scrollPercent <= 20) {
                    this.loadMore = true;
                    await this.append(this.chat.id);
                    this.loadMore = false;
                }
            }
        },

        "chat.messages": {
            handler: function() {
                if (this.autoScroll) {
                    this.$nextTick(() => this.scrollToBottom());
                }
            }
        }
    },

    created() {
        this.id = Number(this.$route.params.chat);
        this.type = this.$route.query.type;
    },

    async mounted() {
        this.chat = await this.load({
            id: this.id,
            type: this.type
        });

        this.loading = false;
        document.addEventListener("keydown", this.exit);
        window.addEventListener("focus", this.focus);
        window.addEventListener("keypress", this.focus);
    },

    beforeDestroy() {
        this.setCurrent(0);
        document.removeEventListener("keydown", this.exit);
        window.removeEventListener("focus", this.focus);
        window.removeEventListener("keypress", this.focus);
    },

    methods: {
        ...mapActions({
            load: "vk/messages/LOAD",
            append: "vk/messages/APPEND",
            setCurrent: "vk/messages/SET_CURRENT"
        }),

        same(index) {
            if (index === 0) {
                return false;
            }

            const currentMessage = this.chat.messages[index];
            const previousMessage = this.chat.messages[index - 1];
            return currentMessage.from_id === previousMessage.from_id;
        },

        focus(event) {
            if (event.type === "keypress" || event.type === "focus") {
                this.$refs.input.$refs.textarea.focus();
            }
        },

        scrollToBottom() {
            this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
            return true;
        },

        exit(event) {
            if (event.code !== "Escape") return false;
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

    &.loading {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &-messages {
        grid-area: messages;

        padding: 10px;

        overflow-x: hidden;
        overflow-y: overlay;

        &-list {
            display: flex;
            flex-direction: column;
            row-gap: 10px;
        }
    }
}
</style>