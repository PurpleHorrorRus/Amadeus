<template>
    <div class="message" :class="messageClass">
        <img v-if="showAvatar" :src="avatar" class="message-avatar">
        <MessageContent />
        <MessageActions />
    </div>
</template>

<script>


export default {
    components: {
        MessageContent: () => import("~/components/Messages/Content"),
        MessageActions: () => import("~/components/Messages/Actions")
    },

    provide() {
        return {
            message: this.message
        };
    },

    props: {
        message: {
            type: Object,
            required: true
        },

        last: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    computed: {
        messageClass() {
            return {
                out: this.message.out,
                last: this.last,
                selected: this.message.selected,
                noBackground: this.message.attachments.length >= 1 
                    && !this.message.text 
                    && !this.isWallAttachment
            };
        },

        conversation() {
            return this.$parent.$parent.current;
        },

        chatUserProfile() {
            return this.conversation.profile.users.find(user => {
                return user.id === this.message.from_id;
            });
        },

        showAvatar() {
            return this.last 
                && this.conversation.profile.type === "chat";
        },

        avatar() {
            return this.chatUserProfile.photo_100;
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

    border-radius: 8px;

    &.selected {
        .message-content {
            border: 1px solid var(--contrast);
        }
    }

    &:hover {
        cursor: pointer;

        .message-actions {
            opacity: 1;
        }
    }

    &:not(.noBackground) {
        --contrast: var(--message-contrast);
        --message-bg: var(--message);

        &.out {
            --contrast: var(--out-contrast);
            --message-bg: var(--out);
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

    &.noBackground {
        .message-content {
            padding: 0px 0px 10px 0px;

            background: none;
        }
    }

    &-avatar {
        align-self: flex-end;

        width: 40px;
        height: 40px;

        border-radius: 100%;
    }
}
</style>