<template>
    <div class="conversation-icons">
        <VolumeMuteIcon
            v-if="$parent.conversation.muted"
            class="icon amadeus mute-icon"
        />

        <ConversationUnread
            v-if="showUnread"
            :conversation="$parent.conversation"
        />
    </div>
</template>

<script>
export default {
    components: {
        ConversationUnread: () => import("~/components/Conversations/Conversation/Unread.vue"),
        VolumeMuteIcon: () => import("~icons/volume-mute.svg")
    },

    computed: {
        inUnread() {
            return this.$parent.conversation.unread > 0;
        },

        outUnread() {
            // eslint-disable-next-line max-len
            return this.$parent.conversation.information.out_read < this.$parent.conversation.information.last_message_id
                && this.$parent.conversation.message.out;
        },

        showUnread() {
            return this.inUnread
                || this.outUnread;
        }
    }
};
</script>

<style lang="scss">
.conversation-icons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    column-gap: 5px;

    padding: 0px 10px;

    .mute-icon {
        width: 18px;

        path {
            fill: var(--small-text);
        }
    }
}
</style>