<template>
    <div class="conversation">
        <img :src="conversation.profile.photo_100" class="conversation-avatar">

        <div class="conversation-message">
            <span class="conversation-message-name" v-text="name" />
            <ConversationMessage v-if="!conversation.typing" :message="conversation.message" />
            <ConversationTyping v-else />
        </div>
        
        <div v-if="outUnread" class="conversation-unread-out" />
        <div v-else-if="inUnread" class="conversation-unread-in">
            <span class="conversation-unread-in-count" v-text="inUnreadCount" />
        </div>
    </div>
</template>

<script>
export default {
    components: {
        ConversationMessage: () => import("~/components/Conversations/Message"),
        ConversationTyping: () => import("~/components/Conversations/Typing")
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
            return this.conversation.information.out_read < this.conversation.information.last_message_id;
        },

        inUnread() {
            return this.conversation.information.in_read < this.conversation.information.last_message_id;
        },

        inUnreadCount() {
            return this.conversation.information.last_message_id - this.conversation.information.in_read;
        }
    }
};
</script>

<style lang="scss">
.conversation {
    display: grid;
    grid-template-columns: 40px 1fr 20px;

    height: 40px;

    column-gap: 10px;

    padding: 0px 0px 0px 8px;

    &-avatar {
        width: 100%;
        height: 100%;

        border-radius: 100%;
    }

    &-message {
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;

        flex-direction: column;

        &-name {
            width: max-content;

            font-size: 14px;
        }

        &-text {
            color: var(--small-text);
            font-size: 12px;
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