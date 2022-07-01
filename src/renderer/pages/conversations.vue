<template>
    <div id="conversations-page" class="page">
        <ConversationsHeader />

        <div id="conversations-page-list">
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

export default {
    components: {
        ConversationsHeader: () => import("~/components/Conversations/Header"),
        Conversation: () => import("~/components/Conversations/Conversation")
    },

    computed: {
        ...mapState({
            conversations: state => state.vk.conversations.list
        })
    },

    async created() {
        const list = await this.fetch();
        console.log(list);
    },

    methods: {
        ...mapActions({
            fetch: "vk/conversations/FETCH"
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