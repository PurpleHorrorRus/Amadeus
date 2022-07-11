<template>
    <div id="profile-information-actions">
        <div id="profile-information-actions-mute" @click="turnMute">
            <AlertIcon 
                v-if="!profileInMute"
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
            @click="openDeleteConfirmation"
        />
    </div>
</template>

<script>
import { mapActions } from "vuex";

import CoreMixin from "~/mixins/core";
import ProfileMixin from "~/mixins/profile";
import ModalMixin from "~/mixins/modal";

export default {
    components: {
        AlertIcon: () => import("~/assets/icons/alert.svg"),
        AlertOffIcon: () => import("~/assets/icons/alert-off.svg"),
        TrashIcon: () => import("~/assets/icons/trash.svg")
    },

    mixins: [CoreMixin, ProfileMixin, ModalMixin],

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        canOpen() {
            return !this.conversation.isChat;
        },

        profileInMute() {
            return this.settings.vk.mute.some(id => {
                return id === this.conversation.id;
            });
        }
    },

    methods: {
        ...mapActions({
            deleteConversation: "vk/conversations/DELETE"
        }),

        turnMute() {
            const muteIndex = this.settings.vk.mute.findIndex(id => {
                return id === this.conversation.id;
            });

            !~muteIndex 
                ? this.settings.vk.mute.push(this.conversation.id)
                : this.settings.vk.mute.splice(muteIndex, 1);

            this.saveSettings(this.settings);
        },

        openDeleteConfirmation() {
            this.confirmation({
                text: "Вы действительно хотите удалить историю сообщений?",
                accept: () => {
                    this.$router.replace("/general").catch(() => {});
                    this.deleteConversation(this.conversation.id);
                }
            });
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