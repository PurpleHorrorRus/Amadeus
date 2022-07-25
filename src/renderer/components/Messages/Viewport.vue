<template>
    <div id="chat-page-viewport" :class="chatViewportClass">
        <div id="chat-page-viewport-messages">
            <MessagesList
                ref="messages"
                :messages="chat.messages"
            />

            <ScrollArrow
                v-if="showScrollArrow"
                @click.native="scrollToBottom"
            />

            <transition name="slide-right">
                <Profile
                    v-if="$parent.opened"
                    v-click-away="closeProfile"
                    :conversation="chat.conversation"
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

    props: {
        chat: {
            type: Object,
            required: true
        }
    },

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
                chat: this.chat.isChat
            };
        },

        canScroll() {
            return !this.chat.search
                && this.chat.messages.length < this.chat.count
                && !this.loadMore;
        },

        showSuggests() {
            return this.input.message.length > 0;
        }
    },

    watch: {
        scrollPercent: {
            handler: function(scrollPercent) {
                return this.chat.conversation.information.unread_count > 0
                    && scrollPercent <= this.percentToRead
                    && this.readOnBottom();
            }
        },

        "chat.messages.length": {
            handler: function() {
                if (this.scrollPercent <= this.percentToRead) {
                    this.scrollToBottom();
                    this.readOnBottom();
                }
            }
        },

        "settings.vk.disable_read": {
            handler: function(disable_read) {
                if (!disable_read) {
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
            await this.append(this.chat.id);
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
            return this.read(this.chat);
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