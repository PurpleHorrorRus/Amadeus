<template>
    <div id="chat-page" class="page">
        <MessagesHeader :conversation="conversation" />
        <div v-if="!loading" id="chat-page-messages" ref="messages">
            <Skeleton 
                v-if="loadMore"
                id="skeleton-messages"
                :count="5"
                :width="'100%'"
                :height="'40px'" 
            />

            <Message
                v-for="(message, index) of chat.messages" 
                :key="message.id"
                :message="message"
                :same="same(index)"
            />
        </div>

        <LoaderIcon 
            v-else 
            class="icon loader-icon spin" 
        />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import ScrollMixin from "~/mixins/scroll";

export default {
    components: {
        MessagesHeader: () => import("~/components/Messages/Header"),
        Message: () => import("~/components/Messages/Message")
    },

    mixins: [ScrollMixin],

    data: () => ({
        loading: true,
        loadMore: false,

        id: 0,
        type: "user",

        autoScroll: false
    }),

    computed: {
        ...mapState({
            conversations: state => state.vk.conversations.list
        }),
    
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
            handler() {
                if (this.autoScroll) {
                    this.$nextTick(() => this.scrollToBottom());
                }
            }
        }
    },

    async created() {
        this.id = Number(this.$route.params.chat);
        this.type = this.$route.query.type;

        this.chat = await this.load({
            id: this.id,
            type: this.type
        });

        this.loading = false;

        for (let i = 0; i < 5; i++) {
            await this.$nextTick();
        }

        this.registerScroll(this.$refs.messages);
        this.scrollToBottom();
    },

    methods: {
        ...mapActions({
            load: "vk/messages/LOAD",
            append: "vk/messages/APPEND"
        }),

        same(index) {
            if (index === 0) {
                return false;
            }

            return this.chat.messages[index].from_id === this.chat.messages[index - 1].from_id;
        },

        scrollToBottom() {
            this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
        }
    }
};
</script>

<style lang="scss">
#chat-page {
    grid-area: page;

    display: grid;
    grid-template-rows: 40px 1fr max-content;
    
    width: 100%;
    height: 100%;

    &-messages {
        display: flex;
        flex-direction: column;
        row-gap: 10px;

        padding: 10px;

        overflow-x: hidden;
        overflow-y: overlay;
    }
}
</style>