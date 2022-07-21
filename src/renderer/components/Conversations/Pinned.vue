<template>
    <div id="conversations-list-pinned">
        <span 
            v-if="!settings.appearance.minimized"
            id="conversations-list-pinned-label" 
            class="small-text"
            v-text="$strings.CONVERSATIONS.PINNED" 
        />

        <Conversation
            v-for="conversation of conversations"
            :key="conversation.message.id"
            :conversation="conversation"
            @click.native.left="$parent.open(conversation)"
            @click.native.right="$parent.openMenu($event, conversation)"
        />
    </div>
</template>

<script>
import CoreMixin from "~/mixins/core";

export default {
    components: {
        Conversation: () => import("~/components/Conversations/Conversation")
    },

    mixins: [CoreMixin],

    props: {
        conversations: {
            type: Array,
            required: true
        }
    }
};
</script>

<style lang="scss">
#conversations-list-pinned {
    border-bottom: 1px solid var(--border);

    &-label {
        display: block;

        padding: 10px;
    }
}
</style>