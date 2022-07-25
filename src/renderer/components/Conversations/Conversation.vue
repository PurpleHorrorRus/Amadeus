<template>
    <div :key="conversation" class="conversation" :class="conversationClass">
        <ConversationAvatar :conversation="conversation" />

        <div v-if="!settings.appearance.minimized || !extended" class="conversation-message">
            <span class="conversation-message-name nowrap" v-text="conversation.name" />
            <ConversationMessage v-if="!conversation.isTyping" :message="conversation.message" />
            <ConversationTyping v-else :conversation="conversation" />
        </div>

        <div class="conversation-icons">
            <VolumeMuteIcon v-if="conversation.muted" class="icon amadeus mute-icon" />
            <ConversationUnread :conversation="conversation" />
        </div>
    </div>
</template>

<script lang="ts">
import { mapState } from "vuex";

import CoreMixin from "~/mixins/core";
import ConversationsMixin from "~/mixins/conversations";
import ProfileMixin from "~/mixins/profile";

export default {
    components: {
        ConversationAvatar: () => import("~/components/Conversations/Conversation/Avatar.vue"),
        ConversationMessage: () => import("~/components/Conversations/Conversation/Message.vue"),
        ConversationTyping: () => import("~/components/Conversations/Conversation/Typing.vue"),
        ConversationUnread: () => import("~/components/Conversations/Conversation/Unread.vue"),
        VolumeMuteIcon: () => import("~icons/volume-mute.svg")
    },

    mixins: [CoreMixin, ConversationsMixin, ProfileMixin],

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        ...mapState({
            current: (state: any) => state.vk.messages.current,
            extended: (state: any) => state.extendedView
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
    grid-template-columns: 40px 1fr max-content;
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

        .mute-icon {
            position: absolute;
            top: 2px; left: 3px;

            width: 18px;

            padding: 3px;

            background: var(--item-disabled);
            border-radius: 100%;

            path {
                fill: var(--text);
            }
        }
    }

    &.active, &:hover {
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

    &-icons {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        column-gap: 10px;

        padding: 0px 10px;

        .mute-icon {
            width: 18px;

            path {
                fill: var(--small-text);
            }
        }
    }
}
</style>