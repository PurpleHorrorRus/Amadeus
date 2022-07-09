<template>
    <div id="conversations" class="page" :class="conversationClass">
        <ConversationsHeader v-if="showHeader" />

        <div id="conversations-list" ref="conversations">
            <div v-if="pinned.order.length > 0" id="conversations-list-pinned">
                <span 
                    v-if="!settings.appearance.minimized"
                    id="conversations-list-pinned-label" 
                    class="small-text"
                    v-text="'Закрепленные чаты'" 
                />

                <Conversation
                    v-for="id in pinned.order"
                    :key="pinned.conversations[id].message.id"
                    :conversation="pinned.conversations[id]"
                    @click.native.left="open(pinned.conversations[id])"
                />
            </div>

            <Conversation
                v-for="id of cache.order"
                :key="cache.conversations[id].message.id + cache.conversations[id].message.text"
                :conversation="cache.conversations[id]"
                @click.native.left="open(cache.conversations[id])"
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
            pinned: state => state.vk.conversations.pinned,
            cache: state => state.vk.conversations.cache,
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

        canScroll() {
            return !this.load 
                && (this.cache.order.length + this.pinned.order.length) < this.count;
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