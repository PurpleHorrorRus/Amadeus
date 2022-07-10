<template>
    <div id="conversations" class="page" :class="conversationClass">
        <ConversationsHeader v-if="showHeader" />

        <div id="conversations-list" ref="conversations">
            <div v-if="pinned.length > 0" id="conversations-list-pinned">
                <span 
                    v-if="!settings.appearance.minimized"
                    id="conversations-list-pinned-label" 
                    class="small-text"
                    v-text="'Закрепленные чаты'" 
                />

                <Conversation
                    v-for="conversation of pinned"
                    :key="conversation.message.id"
                    :conversation="conversation"
                    @click.native.left="open(conversation)"
                />
            </div>

            <Conversation
                v-for="conversation of notPinned"
                :key="conversation.message.id"
                :conversation="conversation"
                @click.native.left="open(conversation)"
            />

            <Skeleton 
                v-if="load"
                id="skeleton-conversations"
                :count="5"
                :width="'100%'"
                :height="'40px'" 
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import CoreMixin from "~/mixins/core";
import ScrollMixin from "~/mixins/scroll";

export default {
    components: {
        ConversationsHeader: () => import("~/components/Conversations/Header"),
        Conversation: () => import("~/components/Conversations/Conversation")
    },

    mixins: [CoreMixin, ScrollMixin],

    data: () => ({
        loadMore: false
    }),

    computed: {
        ...mapState({
            extended: state => state.extendedView,
            conversations: state => state.vk.conversations.cache,
            count: state => state.vk.conversations.count
        }),
        
        conversationClass() {
            return {
                minimized: this.settings.appearance.minimized
            };
        },

        showHeader() {
            return (this.extended && !this.settings.appearance.minimized)
                || !this.extended;
        },

        pinned() {
            return this.conversations.filter(conversation => {
                return conversation.pinned;
            });
        },

        notPinned() {
            return this.conversations.filter(conversation => {
                return !conversation.pinned;
            });
        },

        canScroll() {
            return !this.load 
                && this.conversations.length < this.count;
        }
    },

    mounted() {
        this.registerScroll(this.$refs.conversations, async () => {
            this.loadMore = true;
            await this.append();
            this.loadMore = false;
        }, percent => percent >= 70);
    },

    methods: {
        ...mapActions({
            append: "vk/conversations/APPEND"
        }),

        async open(conversation) {
            const { id, type } = conversation.information.peer;
            return this.$router.replace(`/messages/${id}?type=${type}`).catch(() => {});
        }
    }
};
</script>

<style lang="scss">
#conversations {
    display: grid;
    grid-template-rows: 40px 1fr;

    width: 100%;
    height: 100%;

    overflow-x: hidden;
    overflow-y: auto;

    &.minimized {
        grid-template-rows: 1fr;

        ::-webkit-scrollbar {
            width: 0px;
        }
    }

    &-list {
        display: flex;
        flex-direction: column;

        padding: 5px 0px;

        overflow-x: hidden;
        overflow-y: auto;

        &-pinned {
            border-bottom: 1px solid var(--border);

            &-label {
                display: block;

                padding: 10px;
            }
        }
    }

    .skeleton-list {
        flex-direction: column;
    }
}
</style>