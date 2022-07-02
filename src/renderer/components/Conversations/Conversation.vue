<template>
    <div class="conversation">
        <ConversationAvatar :profile="conversation.profile" />

        <div class="conversation-message">
            <span class="conversation-message-name" v-text="name" />
            <ConversationMessage v-if="!conversation.typing" :message="conversation.message" />
            <ConversationTyping v-else />
        </div>
        
        <div v-if="inUnread" class="conversation-unread-in">
            <span class="conversation-unread-in-count" v-text="inUnreadCount" />
        </div>
        <div v-else-if="outUnread" class="conversation-unread-out" />
    </div>
</template>

<script>
export default {
    components: {
        ConversationAvatar: () => import("~/components/Conversations/Conversation/Avatar"),
        ConversationMessage: () => import("~/components/Conversations/Conversation/Message"),
        ConversationTyping: () => import("~/components/Conversations/Conversation/Typing")
    },

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        name() {
            switch(this.conversation.profile.type) {
                case "chat": {
                    return this.conversation.profile.title;
                }

                case "group": {
                    return this.conversation.profile.name;
                }
                
                default: {
                    return `${this.conversation.profile.first_name} ${this.conversation.profile.last_name}`;
                }
            }
        },

        outUnread() {
            return this.conversation.information.out_read < this.conversation.information.last_message_id
                && this.conversation.message.out;
        },

        inUnread() {
            return this.conversation.information.in_read < this.conversation.information.last_message_id
                && !this.conversation.message.out;
        },

        inUnreadCount() {
            if (this.conversation.information.in_read === 0) {
                return 1;
            }

            return this.conversation.information.last_message_id - this.conversation.information.in_read;
        }
    }
};
</script>

<style lang="scss">
.conversation {
    display: grid;
    grid-template-columns: 40px 1fr 20px;

    height: max-content;

    padding: 0px 0px 0px 8px;

    &-message {
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        flex-direction: column;

        margin-left: 10px;

        &-name {
            width: max-content;

            font-size: 14px;
        }

        &-text {
            color: var(--small-text);
            font-size: 12px;
            font-weight: 300;
        }
    }

    &-unread-out {
        justify-self: center;
        align-self: center;

        width: 4px;
        height: 4px;

        background: var(--secondary);
        border-radius: 100%;
    }

    &-unread-in {
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
    }
}
</style>