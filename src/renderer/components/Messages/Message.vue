<template>
    <div class="message" :class="messageClass">
        <img v-if="showAvatar" :src="avatar" class="message-avatar">
        <MessageContent :message="message" />
        <MessageActions />
    </div>
</template>

<script>


export default {
    components: {
        MessageContent: () => import("~/components/Messages/Content"),
        MessageActions: () => import("~/components/Messages/Actions")
    },

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
                same: this.same && this.isChat,
                noBackground: this.message.attachments.length >= 1 
                    && !this.message.text 
                    && !this.isWallAttachment
            };
        },

        conversation() {
            return this.$parent.current;
        },

        chatUserProfile() {
            return this.conversation.profile.users.find(user => {
                return user.id === this.message.from_id;
            });
        },

        showAvatar() {
            return !this.same 
                && this.isChat;
        },

        avatar() {
            return this.chatUserProfile.photo_100;
        },
        
        isChat() {
            return this.conversation.profile.type === "chat";
        },

        isWallAttachment() {
            return this.message.attachments[0]?.type === "wall";
        }
    }
};
</script>

<style lang="scss">
#default-layout {
    &:not(.extended) {
        .message-content {
            max-width: 60vw;
        }
    }

    .message.same:not(.out) {
        padding-left: 48px;
    }
}

.message {
    display: flex;
    flex-direction: row;
    align-self: flex-start;
    column-gap: 8px;

    &:hover {
        .message-actions {
            opacity: 1;
        }
    }

    &:not(.noBackground) {
        --contrast: var(--message-contrast);

        &.out {
            --contrast: var(--out-contrast);
        }
    }

    &.out {
        align-self: flex-end;
        flex-direction: row-reverse;

        .message-content {
            background: var(--out);
        }

        span.clickable:hover, .clickable:hover span {
            color: var(--out-contrast) !important;
        }

        svg.clickable:hover path, .clickable:hover svg path {
            fill: var(--out-contrast);
        }
    }

    &.same {
        &.out {
            padding-right: 48px;
        }

        &:not(.out) {
            padding-left: 47px;
        }
    }

    &.noBackground {
        .message-content {
            padding: 0px 0px 10px 0px;

            background: none;
        }
    }

    &-avatar {
        width: 40px;
        height: 40px;

        border-radius: 100%;
    }
}
</style>