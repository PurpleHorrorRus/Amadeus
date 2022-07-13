<template>
    <div class="conversation-unread">
        <LoaderIcon
            v-if="isSyncing"
            class="icon spin loader-icon conversation-message-syncing"
        />

        <div v-else-if="showMention" class="conversation-unread-mention">
            <MentionIcon class="icon vkgram" />
        </div>

        <UnreadCounter 
            v-else-if="conversation.information.unread_count > 0"
            :count="conversation.information.unread_count"
        />
    
        <div 
            v-else-if="outUnread" 
            class="conversation-unread-out" 
        />
    </div>
</template>

<script>
export default {
    components: {
        UnreadCounter: () => import("~/components/Messages/Header/UnreadCounter"),
        MentionIcon: () => import("~/assets/icons/mention.svg")
    },

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        isSyncing() {
            return this.conversation.message.syncing === 1;
        },

        isMention() {
            return this.conversation.mention
                && this.inUnread;
        },

        outUnread() {
            return this.conversation.information.out_read < this.conversation.information.last_message_id
                && this.conversation.message.out;
        }
    }
};
</script>

<style lang="scss">
.conversation-unread {
    display: flex;
    justify-content: center;
    align-items: center;

    &-out {
        justify-self: center;
        align-self: center;

        width: 4px;
        height: 4px;

        background: var(--secondary);
        border-radius: 100%;
    }

    &-in, &-mention {
        display: flex;
        justify-content: center;
        align-items: center;
        justify-self: center;
        align-self: center;

        width: 16px;
        height: 16px;

        background: var(--secondary);
        border-radius: 100%;

        &-count {
            font-size: 11px;
            font-weight: 500;
        }

        .icon {
            width: 12px;
        }
    }
}
</style>