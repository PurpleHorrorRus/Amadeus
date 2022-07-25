<template>
    <div id="messages-header-main-profile-information" class="nowrap">
        <span
            id="messages-header-main-profile-information-name"
            class="nowrap"
            v-text="conversation.name"
        />

        <ConversationTyping
            v-if="conversation.isTyping"
            :conversation="conversation"
        />

        <MessagesHeaderOnline
            v-else-if="showLastSeen"
            :conversation="conversation"
        />
    </div>
</template>

<script lang="ts">
import ProfileMixin from "~/mixins/profile";

export default {
    components: {
        ConversationTyping: () => import("~/components/Conversations/Conversation/Typing.vue"),
        MessagesHeaderOnline: () => import("./Online.vue")
    },

    mixins: [ProfileMixin],

    props: {
        conversation: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="scss">
#messages-header-main-profile-information {
    display: flex;
    justify-content: center;
    flex-direction: column;

    &-name {
        font-size: 12px;
    }
}
</style>