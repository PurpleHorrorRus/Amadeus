<template>
    <div id="profile-information-actions">
        <div id="profile-information-actions-mute" @click="turnMute(conversation)">
            <AlertIcon 
                v-if="!conversation.muted"
                v-tooltip.left="'Уведомления включены'" 
                class="icon vkgram clickable"
            />

            <AlertOffIcon 
                v-else
                v-tooltip.left="'Уведомления включены'" 
                class="icon vkgram clickable"
            />
        </div>

        <TrashIcon 
            v-tooltip.left="'Очистить историю'" 
            class="icon vkgram clickable"
            @click="openDeleteConfirmation(conversation)"
        />
    </div>
</template>

<script>
import { mapActions } from "vuex";

import CoreMixin from "~/mixins/core";
import ProfileMixin from "~/mixins/profile";
import ConversationsMixin from "~/mixins/conversations";
import ModalMixin from "~/mixins/modal";

export default {
    components: {
        AlertIcon: () => import("~/assets/icons/alert.svg"),
        AlertOffIcon: () => import("~/assets/icons/alert-off.svg"),
        TrashIcon: () => import("~/assets/icons/trash.svg")
    },

    mixins: [CoreMixin, ProfileMixin, ConversationsMixin, ModalMixin],

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        canOpen() {
            return !this.conversation.isChat;
        }
    },

    methods: {
        ...mapActions({
            deleteConversation: "vk/conversations/DELETE"
        })
    }
};
</script>

<style lang="scss">
#profile-information-actions {
    display: flex;
    flex-direction: row;
    column-gap: 10px;

    &-mute {
        display: flex;
        align-items: center;
    }

    .icon {
        width: 20px;
    }
}
</style>