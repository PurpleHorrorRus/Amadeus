<template>
    <div id="conversations" class="page">
        <ConversationsHeader />

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

import ScrollMixin from "~/mixins/scroll";

export default {
    components: {
        ConversationsHeader: () => import("~/components/Conversations/Header"),
        Conversation: () => import("~/components/Conversations/Conversation")
    },

    mixins: [ScrollMixin],

    data: () => ({
        load: false
    }),

    computed: {
        ...mapState({
            conversations: state => state.vk.conversations.list,
            count: state => state.vk.conversations.count
        }),

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
    grid-area: conversations;

    display: grid;
    grid-template-rows: 40px 1fr;

    width: 100%;
    height: 100%;

    &-list {
        display: flex;
        flex-direction: column;

        padding: 5px 0px;

        overflow-y: auto;
        overflow-x: hidden;
    }

    .skeleton-list {
        flex-direction: column;
    }
}
</style>