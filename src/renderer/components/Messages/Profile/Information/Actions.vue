<template>
    <div id="profile-information-actions">
        <div id="profile-information-actions-mute" @click="turnMute(conversation)">
            <AlertIcon 
                v-if="!conversation.muted"
                v-tooltip.bottom="$strings.TOOLTIP.NOTIFICATIONS.ENABLED"
                class="icon amadeus clickable"
            />

            <AlertOffIcon 
                v-else
                v-tooltip.bottom="$strings.TOOLTIP.NOTIFICATIONS.DISABLED"
                class="icon amadeus clickable"
            />
        </div>

        <TrashIcon 
            v-tooltip.left="$strings.TOOLTIP.CLEAR_HISTORY" 
            class="icon amadeus clickable"
            @click="openDeleteConfirmation(conversation)"
        />
    </div>
</template>

<script>
import CoreMixin from "~/mixins/core";
import ProfileMixin from "~/mixins/profile";
import ConversationsMixin from "~/mixins/conversations";
import ModalMixin from "~/mixins/modal";

export default {
    components: {
        AlertIcon: () => import("~icons/alert.svg"),
        AlertOffIcon: () => import("~icons/alert-off.svg"),
        TrashIcon: () => import("~icons/trash.svg")
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