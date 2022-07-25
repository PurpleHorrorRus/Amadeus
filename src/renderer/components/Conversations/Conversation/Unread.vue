<template>
    <div class="conversation-unread">
        <div v-if="showMention" class="conversation-unread-mention">
            <MentionIcon class="icon amadeus" />
        </div>

        <UnreadCounter
            v-else-if="$parent.inUnread"
            :count="conversation.unread"
        />

        <div
            v-else-if="$parent.outUnread"
            class="conversation-unread-out"
        />
    </div>
</template>

<script lang="ts">
export default {
    components: {
        UnreadCounter: () => import("~/components/Messages/Header/UnreadCounter.vue"),
        MentionIcon: () => import("~icons/mention.svg")
    },

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        isMention() {
            return this.conversation.mention
                && this.$parent.inUnread;
        }
    }
};
</script>

<style lang="scss">
.conversation-unread {
    display: flex;
    justify-content: center;
    align-items: center;

    &-out {
        justify-self: center;
        align-self: center;

        width: 4px;
        height: 4px;

        margin: 0px 9px 0px 7px;

        background: var(--secondary);
        border-radius: 100%;
    }

    &-in, &-mention {
        display: flex;
        justify-content: center;
        align-items: center;
        justify-self: center;
        align-self: center;

        width: 16px;
        height: 16px;

        background: var(--secondary);
        border-radius: 100%;

        &-count {
            font-size: 11px;
            font-weight: 500;
        }

        .icon {
            width: 12px;
        }
    }
}
</style>