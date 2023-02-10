<template>
    <div class="message-actions">
        <CheckIcon
            v-if="canRead"
            v-tooltip="$strings.CHAT.MESSAGE.ACTIONS.READ"
            class="icon amadeus"
            @click.stop="read"
        />

        <ReplyIcon
            v-if="canReply"
            v-tooltip="$strings.CHAT.MESSAGE.ACTIONS.REPLY"
            class="icon amadeus"
            @click.stop="action('reply')"
        />

        <StarIcon
            v-tooltip="$strings.CHAT.MESSAGE.ACTIONS.FAVORITE"
            class="icon amadeus star"
            :class="starClass"
            @click.stop="action('important')"
        />
    </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";

import CoreMixin from "~/mixins/core";
import ActionsMixin from "~/mixins/message/actions";

export default {
    components: {
        ReplyIcon: () => import("~icons/reply.svg"),
        StarIcon: () => import("~icons/star.svg"),
        CheckIcon: () => import("~icons/check.svg")
    },

    mixins: [CoreMixin, ActionsMixin],

    inject: ["message"],

    computed: {
        starClass() {
            return {
                filled: this.message.important
            };
        },

        canReply() {
            return !this.current.information.restricted;
        },

        canRead() {
            return !this.message.out
                && !this.config.vkService.read
                && this.current.information.in_read < this.message.id;
        }
    },

    methods: {
        ...mapActions({
            readMessage: "vk/messages/READ_MESSAGE"
        }),

        read() {
            return this.readMessage({
                chat: this.current,
                message: this.message
            });
        }
    }
};
</script>

<style lang="scss">
.message-actions {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    column-gap: 5px;

    opacity: 0;

    transition: opacity .1s ease-in-out;

    .icon {
        width: 26px;

        padding: 5px;

        background-color: #00000050;
        border-radius: 8px;

        cursor: pointer;

        &:not(.star) {
            path {
                fill: var(--secondary) !important;
            }
        }
    }
}
</style>