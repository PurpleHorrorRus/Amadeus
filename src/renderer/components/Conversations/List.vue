<template>
    <div id="conversations" :class="conversationClass">
        <ConversationsHeader v-if="showHeader" />

        <div id="conversations-lists" ref="conversations">
            <div v-if="pinned.length > 0" id="pinned" class="conversations-list">
                <span
                    id="conversations-list-pinned-label"
                    class="small-text"
                    v-text="$strings.CONVERSATIONS.PINNED"
                />

                <Conversation
                    v-for="conversation of pinned"
                    :key="conversation.message.id"
                    :conversation="conversation"
                    @click.native.left="open(conversation)"
                    @click.native.right="openMenu($event, conversation)"
                />
            </div>

            <div class="conversations-list">
                <Conversation
                    v-for="conversation of notPinned"
                    :key="conversation.message.id"
                    :conversation="conversation"
                    @click.native.left="open(conversation)"
                    @click.native.right="openMenu($event, conversation)"
                />
            </div>
        </div>

        <ContextMenu v-if="menu.show" :menu="menu" />
    </div>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";

import CoreMixin from "~/mixins/core";
import MenuMixin from "~/mixins/menu";
import ConversationsMixin from "~/mixins/conversations";
import ScrollMixin from "~/mixins/scroll";

export default {
    components: {
        ConversationsHeader: () => import("~/components/Conversations/Header.vue"),
        Conversation: () => import("~/components/Conversations/Conversation.vue")
    },

    mixins: [CoreMixin, MenuMixin, ConversationsMixin, ScrollMixin],

    data: () => ({
        loadMore: false
    }),

    computed: {
        ...mapState({
            conversations: (state: any) => state.vk.conversations.cache,
            count: (state: any) => state.vk.conversations.count
        }),

        conversationClass() {
            return {
                minimized: this.settings.appearance.minimized
            };
        },

        showHeader() {
            return !this.settings.appearance.minimized;
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
            return this.$router.replace(`/messages/${id}?type=${type}`).catch(() => (false));
        },

        setMenuItems() {
            this.menu.items = [{
                id: "read",
                label: this.$strings.MENU.CONVERSATIONS.READ,
                show: this.menu.target.unread > 0,
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
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;

    &-lists {
        overflow-x: hidden;
        overflow-y: auto;

        .conversations-list {
            display: flex;
            flex-direction: column;
            row-gap: 10px;

            padding: 5px 0px;

            &#pinned {
                border-bottom: 1px solid var(--border);

                #conversations-list-pinned-label {
                    padding: 10px 10px 0px 10px;
                }
            }
        }
    }
}
</style>