<template>
    <div id="conversations" class="page" :class="conversationClass">
        <ConversationsHeader v-if="showHeader" />

        <div id="conversations-list" ref="conversations">
            <PinnedConversations 
                v-if="pinned.length > 0" 
                :conversations="pinned" 
            />

            <Conversation
                v-for="conversation of notPinned"
                :key="conversation.message.id"
                :conversation="conversation"
                @click.native.left="open(conversation)"
                @click.native.right="openMenu($event, conversation)"
            />
        </div>

        <ContextMenu v-if="menu.show" :menu="menu" />
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import CoreMixin from "~/mixins/core";
import MenuMixin from "~/mixins/menu";
import ConversationsMixin from "~/mixins/conversations";
import ScrollMixin from "~/mixins/scroll";

export default {
    components: {
        ConversationsHeader: () => import("~/components/Conversations/Header"),
        PinnedConversations: () => import("~/components/Conversations/Pinned"),
        Conversation: () => import("~/components/Conversations/Conversation")
    },

    mixins: [CoreMixin, MenuMixin, ConversationsMixin, ScrollMixin],

    data: () => ({
        loadMore: false
    }),

    computed: {
        ...mapState({
            extended: state => state.extendedView,
            conversations: state => state.vk.conversations.cache,
            count: state => state.vk.conversations.count
        }),
        
        conversationClass() {
            return {
                minimized: this.settings.appearance.minimized
            };
        },

        showHeader() {
            return (this.extended && !this.settings.appearance.minimized)
                || !this.extended;
        },

        pinned() {
            return this.conversations.filter(conversation => {
                return conversation.pinned;
            });
        },

        notPinned() {
            return this.conversations.filter(conversation => {
                return !conversation.pinned;
            });
        },

        canScroll() {
            return this.conversations.length < this.count;
        },

        muteLabel() {
            return this.menu.target?.muted
                ? this.$strings.MENU.CONVERSATIONS.UNMUTE
                : this.$strings.MENU.CONVERSATIONS.MUTE;
        }
    },

    async mounted() {
        this.registerScroll("conversations", async () => {
            if (this.loadMore || !this.canScroll) {
                return false;
            }

            this.loadMore = true;
            await this.append();
            this.loadMore = false;
        }, percent => percent >= 70);
    },

    methods: {
        ...mapActions({
            append: "vk/conversations/APPEND",
            read: "vk/messages/READ"
        }),

        async open(conversation) {
            const { id, type } = conversation.information.peer;
            return this.$router.replace(`/messages/${id}?type=${type}`).catch(() => {});
        },

        setMenuItems() {
            this.menu.items = [{
                id: "read",
                label: this.$strings.MENU.CONVERSATIONS.READ,
                show: this.menu.target.information.unread_count > 0,
                function: () => this.readConversation(this.menu.target)
            },
        
            {
                id: "mute",
                label: this.muteLabel,
                function: () => this.turnMute(this.menu.target)
            },
        
            {
                id: "delete",
                label: this.$strings.MENU.CONVERSATIONS.DELETE,
                function: () => this.openDeleteConfirmation(this.menu.target)
            }];
        }
    }
};
</script>

<style lang="scss">
#conversations {
    display: grid;
    grid-template-rows: 40px 1fr;

    width: 100%;
    height: 100%;

    overflow-x: hidden;
    overflow-y: auto;

    &.minimized {
        grid-template-rows: 1fr;

        ::-webkit-scrollbar {
            width: 0px;
        }
    }

    &-list {
        display: flex;
        flex-direction: column;

        padding: 5px 0px;

        overflow-x: hidden;
        overflow-y: auto;
    }

    .skeleton-list {
        flex-direction: column;
    }
}
</style>