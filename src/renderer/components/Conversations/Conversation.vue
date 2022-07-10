<template>
    <div :key="conversation" class="conversation" :class="conversationClass">
        <ConversationAvatar :profile="conversation.profile" />

        <div v-if="!settings.appearance.minimized || !extended" class="conversation-message">
            <span class="conversation-message-name nowrap" v-text="name(conversation.profile)" />
            <ConversationMessage v-if="!conversation.typing.enable" :message="conversation.message" />
            <ConversationTyping v-else :typing="conversation.typing" />
        </div>

        <ConversationUnread :conversation="conversation" />
    </div>
</template>

<script>
import { mapState } from "vuex";

import CoreMixin from "~/mixins/core";
import ProfileMixin from "~/mixins/profile";

export default {
    components: {
        ConversationAvatar: () => import("~/components/Conversations/Conversation/Avatar"),
        ConversationMessage: () => import("~/components/Conversations/Conversation/Message"),
        ConversationTyping: () => import("~/components/Conversations/Conversation/Typing"),
        ConversationUnread: () => import("~/components/Conversations/Conversation/Unread")
    },

    mixins: [CoreMixin, ProfileMixin],

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        ...mapState({
            current: state => state.vk.messages.current,
            extended: state => state.extendedView
        }),

        conversationClass() {
            return {
                active: this.current?.id === this.conversation.id,
                minimized: this.settings.appearance.minimized && this.extended
            };
        }
    }
};
</script>

<style lang="scss">
.conversation {
    position: relative;

    display: grid;
    grid-template-columns: 40px 1fr 20px;
    grid-template-rows: 50px;
    align-items: center;

    height: 50px;

    margin: 5px;
    padding-left: 8px;
    
    border-radius: 4px;

    span {
        font-weight: 600;
    }

    &.minimized {
        grid-template-columns: 1fr;
        
        padding-left: 0px;

        .conversation-avatar {
            justify-self: center;
        }

        .conversation-unread {
            position: absolute;
            top: 3px; right: 2px;
        }
    }

    &.active {
        background: var(--navigation-select);
    }

    &:hover {
        cursor: pointer;
    }

    &-message {
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        flex-direction: column;

        margin-left: 10px;
        padding-right: 10px;

        &-name {
            width: 100%;

            font-size: 14px;
        }

        &-text {
            color: var(--small-text);
            font-size: 12px;
            font-weight: 300;
        }

        &-syncing {
            width: 14px;

            path {
                stroke: var(--small-text);
            }
        }
    }
}
</style>