<template>
    <div id="search-page" :class="pageClass">
        <MessagesHeaderBack v-if="!extended && !first" ref="back" />

        <div v-if="!first" id="search-page-list" ref="messages">
            <SearchMessage
                v-for="message of messages"
                :key="message.date"
                :message="message"
                @click.native="open(message)"
            />
        </div>

        <LoaderIcon v-else class="icon spin loader-icon" />
    </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";

import PageMixin from "~/mixins/page";
import ScrollMixin from "~/mixins/scroll";

export default {
    components: {
        MessagesHeaderBack: () => import("~/components/Messages/Header/Back.vue"),
        SearchMessage: () => import("~/components/Messages/Important.vue")
    },

    mixins: [PageMixin, ScrollMixin],

    data: () => ({
        first: true,
        loadMore: false,

        messages: [],
        count: 0
    }),

    computed: {
        ...mapState({
            extended: (state: any) => state.extendedView
        }),

        canScroll() {
            return this.messages.length < this.count;
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
            this.registerScroll("messages", async () => {
                if (this.loadMore || !this.canScroll) {
                    return false;
                }

                this.loadMore = true;

                const more = await this.fetch({
                    q: this.$route.query.q,
                    offset: this.messages.length
                });

                this.messages = this.messages.concat(more.messages);
                this.loadMore = false;
            }, percent => percent >= 80);
        });
    },

    methods: {
        ...mapActions({
            fetch: "vk/search/FETCH"
        }),

        async loadResults(q) {
            const results = await this.fetch({
                q: String(q),
                offset: 0
            });

            this.messages = results.messages;
            this.count = results.count;

            if (this.first) {
                this.first = false;
            }

            return this.search;
        },

        open(message) {
            const query = new URLSearchParams({
                type: message.profile.profileType,
                start_message_id: message.id
            }).toString();

            return this.$router.replace(`/messages/${message.peer_id}?${query}`);
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