<template>
    <div id="chat-page-viewport" :class="chatViewportClass">
        <div id="chat-page-viewport-messages">
            <MessagesList
                ref="messages"
                :messages="$parent.chat.messages"
            />

            <ScrollArrow
                v-if="showScrollArrow"
                @click.native="scrollToBottom"
            />

            <transition name="slide-right">
                <Profile
                    v-if="$parent.opened"
                    v-click-away="closeProfile"
                    :conversation="$parent.chat.conversation"
                />
            </transition>
        </div>

        <transition name="fade">
            <Suggests v-if="showSuggests" />
        </transition>
    </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";

import CoreMixin from "~/mixins/core";
import ScrollMixin from "~/mixins/scroll";

export default {
    components: {
        MessagesList: () => import("~/components/Messages/List.vue"),
        Profile: () => import("~/components/Messages/Profile.vue"),
        Suggests: () => import("~/components/Messages/Suggests.vue"),
        ScrollArrow: () => import("~/components/Messages/ScrollArrow.vue")
    },

    mixins: [CoreMixin, ScrollMixin],

    data: () => ({
        loadMore: false,
        showScrollArrow: false,
        percentToRead: 10
    }),

    computed: {
        ...mapState({
            input: (state: any) => state.input
        }),

        chatViewportClass() {
            return {
                chat: this.$parent.chat.isChat
            };
        },

        canScroll() {
            return !this.$parent.chat.search
                && this.$parent.chat.messages.length < this.$parent.chat.count
                && !this.loadMore;
        },

        showSuggests() {
            return this.input.message.length > 0;
        }
    },

    watch: {
        scrollPercent: {
            handler: function(scrollPercent) {
                return this.$parent.chat.conversation.unread > 0
                    && scrollPercent <= this.percentToRead
                    && this.readOnBottom();
            }
        },

        "$parent.chat.messages.length": {
            handler: function() {
                if (this.scrollPercent <= this.percentToRead) {
                    this.scrollToBottom();
                    this.readOnBottom();
                }
            }
        },

        "config.vkService.read": {
            handler: function(read) {
                if (!read) {
                    this.readOnBottom();
                }
            }
        }
    },

    async mounted() {
        await this.registerScroll("messages", async () => {
            if (this.loadMore || !this.canScroll) {
                return false;
            }

            this.loadMore = true;
            await this.append(this.$parent.chat.id);
            this.loadMore = false;
        }, percent => {
            this.showScrollArrow = percent > 10
                && this.$refs.messages.$el.scrollTop !== 0;

            return percent > 80;
        });

        window.addEventListener("focus", this.readOnBottom);
        this.readOnBottom();
    },

    beforeDestroy() {
        window.removeEventListener("focus", this.readOnBottom);
    },

    methods: {
        ...mapActions({
            append: "vk/messages/APPEND",
            read: "vk/messages/READ"
        }),

        scrollToBottom() {
            return this.$refs.messages.scrollToBottom();
        },

        readOnBottom() {
            return this.read(this.$parent.chat);
        },

        closeProfile() {
            this.$parent.turnProfile();
        }
    }
};
</script>

<style lang="scss">
.slide-right-enter-active, .slide-right-leave-active  {
    transition: all .3s ease;
}

.slide-right-enter, .slide-right-leave-to {
    transform: translateX(350px);
}

#chat-page-viewport {
    width: 100%;
    height: 100%;

    position: relative;

    &-messages {
        position: relative;

        height: 100%;

        background-repeat: no-repeat;

        overflow-x: hidden;

        .scroll-arrow {
            position: absolute;
            bottom: 10px; right: 10px;
        }
    }
}
</style>