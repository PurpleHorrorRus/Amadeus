<template>
    <div id="search-page" :class="pageClass">
        <MessagesHeaderBack v-if="!extended && !first" ref="back" />

        <div v-if="!first" id="search-page-list" ref="messages">
            <SearchMessage
                v-for="conversation of search.conversations"
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
        SearchMessage: () => import("~/components/Messages/Important")
    },

    mixins: [PageMixin, ScrollMixin],

    data: () => ({
        first: true,
        loadMore: false,

        search: {
            count: 0,
            conversations: []
        }
    }),

    computed: {
        ...mapState({
            extended: state => state.extendedView
        }),

        canScroll() {
            return this.search.conversations.length < this.search.count;
        }
    },

    watchQuery(query) {
        this.first = true;
        this.loadResults(query.q);
    },

    async created() {
        await this.loadResults(this.$route.query.q);
        this.first = false;

        this.$nextTick(() => {
            this.registerScroll(this.$refs.messages, async () => {
                this.loadMore = true;

                const more = await this.fetch({
                    q: this.$route.query.q,
                    offset: this.search.conversations.length
                });

                this.search.conversations = this.search.conversations.concat(more.conversations);
                this.loadMore = false;
            }, percent => percent >= 80);
        });
    },

    methods: {
        ...mapActions({
            fetch: "vk/search/FETCH"
        }),

        async loadResults(q) {
            this.search = await this.fetch({
                q,
                offset: 0
            });

            if (this.first) {
                this.first = false;
            }

            return this.search;
        },

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
#search-page {
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