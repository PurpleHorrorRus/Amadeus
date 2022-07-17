<template>
    <div id="chat-page-viewport" :class="chatViewportClass">
        <div id="chat-page-viewport-messages">
            <MessagesList ref="messages" :messages="chat.messages" />
            <ScrollArrow v-if="showScrollArrow" @click.native="scrollToBottom" />

            <transition name="slide-right">
                <Profile 
                    v-if="$parent.opened" 
                    v-click-away="closeProfile"
                    :conversation="chat.conversation" 
                />
            </transition>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";

import MessagesList from "~/components/Messages/List";

import CoreMixin from "~/mixins/core";
import ScrollMixin from "~/mixins/scroll";

export default {
    components: {
        MessagesList,
        Profile: () => import("~/components/Messages/Profile"),
        ScrollArrow: () => import("~/components/Messages/ScrollArrow")
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
        percentToRead: 80
    }),

    computed: {
        chatViewportClass() {
            return {
                chat: this.chat.isChat
            };
        },

        canScroll() {
            return this.chat.messages.length < this.chat.count
                && !this.loadMore;
        }
    },

    watch: {
        scrollPercent: {
            handler: function() {
                if (this.chat.conversation.information.unread_count > 0) {
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
        },

        "chat.messages": {
            handler: function() {
                if (this.scrollPercent > this.percentToRead) {
                    this.$nextTick(() => this.scrollToBottom());
                }
            }
        }
    },

    async mounted() {
        window.addEventListener("focus", this.readOnBottom);

        this.registerScroll("messages", async () => {
            if (this.loadMore || !this.canScroll) {
                return false;
            }

            this.loadMore = true;
            await this.append(this.chat.id);
            this.loadMore = false;
        }, percent => {
            this.showScrollArrow = percent < 90 
                && this.$refs.messages.$el.scrollTop > 0;

            return percent < 20;
        });

        this.scrollToBottom();
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
            this.$refs.messages.$el.scrollTop = this.$refs.messages.$el.scrollHeight;
            this.readOnBottom();
            return true;
        },

        readOnBottom() {
            if (this.scrollPercent < this.percentToRead && this.$refs.messages.$el.scrollTop !== 0) {
                return false;
            }

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