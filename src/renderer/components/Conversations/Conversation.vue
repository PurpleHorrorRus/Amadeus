<template>
    <div class="conversation">
        <img :src="conversation.profile.photo_100" class="conversation-avatar">

        <div class="conversation-message">
            <span class="conversation-message-name" v-text="name" />
            <ConversationMessage v-if="!conversation.typing" :message="conversation.message" />
        </div>
        
        <div v-if="outUnread" class="conversation-read" />
    </div>
</template>

<script>
export default {
    components: {
        ConversationMessage: () => import("~/components/Conversations/Message")
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
            return this.conversation.information.out_read !== this.conversation.information.last_message_id;
        }
    }
};
</script>

<style lang="scss">
.conversation {
    display: grid;
    grid-template-columns: 40px 1fr 10px;

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

    &-read {
        justify-self: center;
        align-self: center;

        width: 4px;
        height: 4px;

        background: var(--secondary);
        border-radius: 100%;
    }
}
</style>