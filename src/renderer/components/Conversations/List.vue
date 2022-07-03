<template>
    <div id="conversations" class="page" :class="conversationClass">
        <ConversationsHeader v-if="!settings.appearance.minimized" />

        <div id="conversations-list" ref="conversations">
            <Conversation
                v-for="(conversation, index) of conversations"
                :key="index"
                :conversation="conversation"
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
        load: false
    }),

    computed: {
        ...mapState({
            conversations: state => state.vk.conversations.list,
            count: state => state.vk.conversations.count
        }),
        
        conversationClass() {
            return {
                minimized: this.settings.appearance.minimized
            };
        },

        canScroll() {
            return !this.load 
                && this.conversations.length < this.count;
        }
    },

    async created() {
        if (this.conversations.length === 0) {
            await this.fetch();
        }
    },

    mounted() {
        this.registerScroll(this.$refs.conversations, async () => {
            this.load = true;
            await this.append();
            this.load = false;
        });
    },

    methods: {
        ...mapActions({
            fetch: "vk/conversations/FETCH",
            append: "vk/conversations/APPEND"
        })
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
    }

    .skeleton-list {
        flex-direction: column;
    }
}
</style>