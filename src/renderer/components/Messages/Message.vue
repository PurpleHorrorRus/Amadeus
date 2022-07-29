<template>
    <div class="message" :class="messageClass">
        <img v-if="showAvatar" :src="avatar" class="message-avatar">
        <MessageContent />
        <MessageActions />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        MessageContent: () => import("~/components/Messages/Content.vue"),
        MessageActions: () => import("~/components/Messages/Actions.vue")
    },

    provide() {
        return {
            message: this.message
        };
    },

    inject: ["provideData"],

    props: {
        message: {
            type: Object,
            required: true
        },

        first: {
            type: Boolean,
            required: false,
            default: false
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
                    && this.message.fwd_messages.length === 0
            };
        },

        chatUserProfile() {
            return this.provideData.conversation.users.find(user => {
                return user.id === this.message.from_id;
            });
        },

        showAvatar() {
            return this.last
                && this.provideData.conversation.isChat;
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

    #chat-page.chat {
        .message:not(.last) {
            &.out { padding-right: 48px; }
            &:not(.out) { padding-left: 48px; }
        }
    }
}

.message {
    display: flex;
    flex-direction: row;
    align-self: flex-start;
    column-gap: 8px;

    border-radius: 8px;

    &.selected {
        transform: scale(.95);
    }

    &:hover {
        cursor: pointer;

        .message-actions {
            opacity: 1;
        }
    }

    &.out {
        align-self: flex-end;
        flex-direction: row-reverse;

        --contrast: var(--out-contrast);

        .message-content {
            background: var(--out);
        }

        &:not(.noBackground) {
            span.clickable:hover, .clickable:hover span {
                color: var(--out-contrast) !important;
            }

            svg.clickable:hover path, .clickable:hover svg path {
                fill: var(--out-contrast);
            }
        }
    }

    &:not(.out) {
        --contrast: var(--message-contrast);

        span {
            &::selection {
                background: var(--secondary) !important;
            }
        }
    }

    &.noBackground {
        --contrast: var(--secondary);

        .message-content {
            padding: 0px 0px 10px 0px;

            background: none;
        }
    }

    &-avatar {
        align-self: flex-end;

        width: 10vw;
        max-width: 40px;

        border-radius: 100%;
    }
}
</style>