<template>
    <div id="important-page" :class="pageClass">
        <MessagesHeaderBack v-if="!first" ref="back" />

        <div v-if="!first" id="important-page-list" ref="messages">
            <ImportantMessage
                v-for="message of messages"
                :key="message.id"
                :message="message"
                @click.native="open(message)"
            />
        </div>

        <LoaderIcon v-else class="icon spin loader-icon" />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

import PageMixin from "~/mixins/page";
import ScrollMixin from "~/mixins/scroll";

export default {
    components: {
        MessagesHeaderBack: () => import("~/components/Messages/Header/Back.vue"),
        ImportantMessage: () => import("~/components/Messages/Important.vue")
    },

    mixins: [PageMixin, ScrollMixin],

    data: () => ({
        loadMore: false,
        messages: [],
        count: 0
    }),

    computed: {
        canScroll() {
            return this.messages.length < this.count;
        }
    },

    async created() {
        const response = await this.fetch(0);
        this.messages = response.messages;
        this.count = response.count;
        this.first = false;

        this.$nextTick(() => {
            this.registerScroll("messages", async () => {
                if (this.loadMore || !this.canScroll) {
                    return false;
                }

                this.loadMore = true;
                const more = await this.fetch(this.messages.length);
                this.messages = this.messages.concat(more.messages);
                this.loadMore = false;
            }, percent => percent >= 80);
        });
    },

    methods: {
        ...mapActions({
            fetch: "vk/important/FETCH"
        }),

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
#important-page {
    display: flex;
    flex-direction: column;
    row-gap: 20px;

    padding: 10px;

    #messages-header-back {
        height: 20px;
    }

    &-list {
        display: flex;
        flex-direction: column;
        row-gap: 20px;

        overflow-x: hidden;
        overflow-y: overlay;
    }
}
</style>