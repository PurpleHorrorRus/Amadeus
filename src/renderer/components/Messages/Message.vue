<template>
    <div class="message" :class="messageClass">
        <img 
            v-if="showAvatar" 
            :src="avatar" 
            class="message-avatar"
        >

        <div class="message-content">
            <span v-if="showName" class="message-content-name" v-text="name" />
            <span class="message-content-text" v-text="message.text" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        message: {
            type: Object,
            required: true
        },

        same: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    computed: {
        messageClass() {
            return {
                out: this.message.out,
                same: this.same && this.isChat
            };
        },

        isChat() {
            return this.$parent.conversation.profile.type === "chat";
        },

        chatUserProfile() {
            return this.$parent.conversation.profile.users.find(user => {
                return user.id === this.message.from_id;
            });
        },

        showAvatar() {
            return !this.same && this.isChat;
        },

        avatar() {
            return this.chatUserProfile.photo_100;
        },

        showName() {
            return !this.same
                && !this.message.out 
                && this.isChat;
        },

        name() {
            return this.chatUserProfile.first_name;
        }
    }
};
</script>

<style lang="scss">
.message {
    display: flex;
    flex-direction: row;
    align-self: flex-start;
    column-gap: 8px;

    &.out {
        align-self: flex-end;
        flex-direction: row-reverse;

        .message-content {
            background: var(--secondary);
        }
    }

    &.same {
        &.out {
            padding-right: 48px;
        }

        &:not(.out) {
            padding-left: 48px;
        }
    }

    &-avatar {
        width: 40px;
        height: 40px;

        border-radius: 100%;
    }

    &-content {
        display: flex;
        flex-direction: column;
        align-self: flex-start;
        row-gap: 5px;

        max-width: 60vw;

        padding: 10px;

        background: #242424;
        border-radius: 8px;
        
        &-name {
            color: #0099ff;
            font-size: 12px;
        }

        &-text {
            font-size: 14px;
            font-weight: 400;
        }
    }
}
</style>