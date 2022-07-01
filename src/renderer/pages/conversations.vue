<template>
    <div id="conversations-page" class="page">
        <ConversationsHeader />

        <div id="conversations-page-list" ref="conversations">
            <Conversation
                v-for="(conversation, index) of conversations"
                :key="index"
                :conversation="conversation"
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
#conversations-page {
    grid-area: page;

    display: grid;
    grid-template-rows: 40px 1fr;

    width: 100%;
    height: 100%;

    &-list {
        display: flex;
        flex-direction: column;
        row-gap: 15px;

        padding: 5px 0px;

        overflow-y: auto;
        overflow-x: hidden;

        &:hover {
            cursor: pointer;
        }
    }
}
</style>