<template>
    <div
        :key="conversation"
        class="conversation"
        :class="conversationClass"
    >
        <ConversationAvatar :conversation="conversation" />

        <div class="conversation-message">
            <span class="conversation-message-name nowrap" v-text="conversation.name" />
            <ConversationMessage v-if="!conversation.isTyping" :message="conversation.message" />
            <ConversationTyping v-else :conversation="conversation" />
        </div>

        <div class="conversation-icons">
            <VolumeMuteIcon
                v-if="conversation.muted"
                class="icon amadeus mute-icon"
            />

            <ConversationUnread
                v-if="inUnread || outUnread"
                :conversation="conversation"
            />
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
            current: (state: any) => state.vk.messages.current
        }),

        conversationClass() {
            return {
                active: this.current?.id === this.conversation.id
            };
        },

        inUnread() {
            return this.conversation.unread > 0;
        },

        outUnread() {
            return this.conversation.information.out_read < this.conversation.information.last_message_id
                && this.conversation.message.out;
        }
    }
};
</script>

<style lang="scss">
@mixin Conversation {
    position: relative;

    display: grid;
    grid-template-columns: 40px 1fr max-content;
    grid-template-rows: 50px;
    align-items: center;

    height: 50px;

    margin: 0px 5px;
    padding: 0px 5px;

    border-radius: 4px;

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
        column-gap: 5px;

        padding: 0px 10px;

        .mute-icon {
            width: 18px;

            path {
                fill: var(--small-text);
            }
        }
    }
}

.conversation {
    span {
        font-weight: 600;
    }

    &.active, &:hover {
        background: var(--navigation-select);
    }

    &:hover {
        cursor: pointer;
    }
}

@media screen and (max-width: 599px) {
    .conversation {
        @include Conversation;
    }
}

@media screen and (min-width: 600px) {
    #conversations {
        &:not(.minimized) .conversation {
            @include Conversation;
        }

        &.minimized {
            #conversations-lists {
                &::-webkit-scrollbar {
                    width: 0px;
                    height: 0px;
                }

                .conversations-list {
                    row-gap: 5px;
                }

                #conversations-list-pinned-label {
                    display: none;
                }

                .conversation {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    margin: 0px 5px;
                    padding: 5px 0px;

                    border-radius: 4px;

                    .conversation-message {
                        display: none;
                    }

                    .conversation-icons {
                        position: relative;

                        .conversation-unread-out {
                            position: absolute;
                            top: -20px; right: -13px;
                        }

                        .unread-counter {
                            position: absolute;
                            top: -25px; left: -13px;
                        }

                        .mute-icon {
                            position: absolute;
                            left: -45px; top: -25px;

                            width: 20px;

                            padding: 3px;

                            background: var(--backdrop);
                            border-radius: 100%;
                        }
                    }
                }
            }
        }
    }
}

</style>