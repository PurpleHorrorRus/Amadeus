<template>
    <div id="important-page" :class="pageClass">
        <MessagesHeaderBack v-if="!extended && !first" ref="back" />

        <div v-if="!first" id="important-page-list" ref="messages">
            <ImportantMessage
                v-for="conversation of important.conversations"
                :key="conversation.message.date"
                :conversation="conversation"
                @click.native="open(conversation)"
            />
        </div>

        <LoaderIcon v-else class="icon spin loader-icon" />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import PageMixin from "~/mixins/page";
import ScrollMixin from "~/mixins/scroll";

export default {
    components: {
        MessagesHeaderBack: () => import("~/components/Messages/Header/Back"),
        ImportantMessage: () => import("~/components/Messages/Important")
    },

    mixins: [PageMixin, ScrollMixin],

    data: () => ({
        loadMore: false,
        important: {
            count: 0,
            conversations: []
        }
    }),

    computed: {
        ...mapState({
            extended: state => state.extendedView
        }),

        canScroll() {
            return this.important.conversations.length < this.important.count;
        }
    },

    async created() {
        this.important = await this.fetch(0);
        this.first = false;

        this.$nextTick(() => {
            this.registerScroll(this.$refs.messages, async () => {
                this.loadMore = true;
                const more = await this.fetch(this.important.conversations.length);
                this.important.conversations = this.important.conversations.concat(more.conversations);
                this.loadMore = false;
            }, percent => percent >= 80);
        });
    },

    methods: {
        ...mapActions({
            fetch: "vk/important/FETCH"
        }),

        open(conversation) {
            const query = new URLSearchParams({
                type: conversation.information.peer.type,
                start_message_id: conversation.message.id
            }).toString();

            return this.$router.replace(`/messages/${conversation.information.peer.id}?${query}`);
        }
    }
};
</script>

<style lang="scss">
#important-page {
    display: flex;
    flex-direction: column;
    row-gap: 20px;

    padding: 10px;

    &-list {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        
        overflow-x: hidden;
        overflow-y: overlay;
    }
}
</style>