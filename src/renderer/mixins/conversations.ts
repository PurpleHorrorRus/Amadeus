import { mapActions } from "vuex";
import Conversation from "~/instances/Conversations/Convesration";

import CoreMixin from "~/mixins/core";
import ModalMixin from "~/mixins/modal";

export default {
    mixins: [CoreMixin, ModalMixin],

    methods: {
        ...mapActions({
            deleteConversation: "vk/conversations/DELETE"
        }),

        async openConversation(conversation) {
            const { id, type } = conversation.information.peer;
            return this.$router.replace(`/messages/${id}?type=${type}`).catch(() => (false));
        },

        async readConversation(conversation: Conversation) {
            conversation.readIn(conversation.message.id);
            return await this.client.api.messages.markAsRead({
                peer_id: conversation.id,
                start_message_id: conversation.message.id
            });
        },

        profileInMute(conversation: Conversation): boolean {
            return this.settings.vk.mute.includes(conversation.id);
        },

        turnMute(conversation: Conversation): void {
            conversation.setMute(!conversation.muted);

            if (conversation.muted) {
                this.settings.vk.mute.push(conversation.id);
            } else {
                const muteIndex = this.settings.vk.mute.findIndex(id => {
                    return id === conversation.id;
                });

                this.settings.vk.mute.splice(muteIndex, 1);
            }

            this.saveSettings(this.settings);
        },

        openDeleteConfirmation(conversation: Conversation): void {
            this.confirmation({
                text: "Вы действительно хотите удалить историю сообщений?",
                accept: () => {
                    this.$router.replace("/general").catch(() => (false));
                    this.deleteConversation(conversation.id);
                }
            });
        }
    }
};