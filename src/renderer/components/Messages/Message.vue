<template>
    <div class="message" :class="messageClass">
        <img 
            v-if="showAvatar" 
            :src="avatar" 
            class="message-avatar"
        >

        <div class="message-content">
            <span 
                v-if="showName" 
                class="message-content-name" 
                v-text="name" 
            />

            <MessageReply 
                v-if="message.reply_message"
                :message="message.reply_message"
            />

            <span v-if="message.text" class="message-content-text" v-text="message.text" />

            <MessageAttachments 
                v-if="showAttachments"
                :attachments="message.attachments"
            />

            <div class="message-content-info">
                <span 
                    class="message-content-info-date" 
                    v-text="relativeDate(message.date * 1000)" 
                />

                <CheckIcon 
                    v-if="showCheckIcon"
                    class="icon message-content-info-read" 
                    :class="checkIconClass"
                />
            </div>
        </div>
    </div>
</template>

<script>
import DateMixin from "~/mixins/date";

export default {
    components: {
        MessageReply: () => import("~/components/Messages/Reply"),
        MessageAttachments: () => import("~/components/Messages/Attachments"),
        CheckIcon: () => import("~/assets/icons/check.svg")
    },

    mixins: [DateMixin],

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

        checkIconClass() {
            return {
                read: !this.isNotRead
            };
        },

        showCheckIcon() {
            return this.message.out
                && !this.message.fast 
                && !this.isNotRead;
        },

        conversation() {
            return this.$parent.conversation;
        },

        isWallAttachment() {
            return this.message.attachments[0]?.type === "wall";
        },

        isNotRead() {
            return this.conversation.information.out_read < this.message.id;
        },

        isChat() {
            return this.conversation.profile.type === "chat";
        },

        chatUserProfile() {
            return this.conversation.profile.users.find(user => {
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
        },

        showAttachments() {
            return this.message.attachments.length > 0
                || this.message.geo;
        }
    }
};
</script>

<style lang="scss">
#default-layout {
    &.extended {
        .message-content {
            max-width: 35vw;
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

    &.out {
        align-self: flex-end;
        flex-direction: row-reverse;

        &:not(.noBackground) {
            --secondary: var(--out-contrast);
        }

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

    &-content {
        display: flex;
        flex-direction: column;
        align-self: center;
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

            user-select: text;
        }

        &-info {
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            column-gap: 5px;

            &-date {
                font-size: 10px;
            }

            &-read {
                width: 14px;

                &.read path {
                    stroke: var(--out-contrast);
                }
            }
        }
    }
}
</style>