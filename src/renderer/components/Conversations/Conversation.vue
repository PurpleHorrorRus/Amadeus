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

        <ConversationIcons />
    </div>
</template>

<script lang="ts">
import { mapState } from "vuex";

import CoreMixin from "~/mixins/core";
import ConversationsMixin from "~/mixins/conversations";
import ProfileMixin from "~/mixins/profile";

export default {
    components: {
        ConversationAvatar: () => import("./Conversation/Avatar.vue"),
        ConversationMessage: () => import("./Conversation/Message.vue"),
        ConversationTyping: () => import("./Conversation/Typing.vue"),
        ConversationIcons: () => import("./Conversation/Icons.vue")
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
        }
    }
};
</script>

<style lang="scss">
@mixin Conversation {
    position: relative;

    display: grid;
    grid-template-columns: 40px 1fr max-content;
    grid-template-rows: 60px;
    align-items: center;

    height: 60px;

    padding: 0px 10px;

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
        background: var(--conversations);

        &:not(.minimized) .conversation {
            @include Conversation;
        }

        &.minimized {
            background: var(--conversations-collapsed);

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
                    position: relative;

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
                        position: absolute;

                        .conversation-unread-out {
                            position: absolute;
                            top: -20px; right: -20px;
                        }

                        .unread-counter {
                            position: absolute;
                            top: -22px; left: 13px;
                        }

                        .mute-icon {
                            position: absolute;
                            left: -13px; bottom: -22px;

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