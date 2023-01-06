import { mapActions } from "vuex";
import Conversation from "~/instances/Conversations/Convesration";

import CoreMixin from "~/mixins/core";
import ModalMixin from "~/mixins/modal";

export default {
    mixins: [CoreMixin, ModalMixin],

    methods: {
        ...mapActions({
            openConversation: "OPEN_CONVERSATION",
            deleteConversation: "vk/conversations/DELETE"
        }),

        async readConversation(conversation: Conversation) {
            conversation.readIn(conversation.message.id);
            return await this.client.api.messages.markAsRead({
                peer_id: conversation.id,
                start_message_id: conversation.message.id
            });
        },

        profileInMute(conversation: Conversation): boolean {
            return this.config.vkService.mute.includes(conversation.id);
        },

        turnMute(conversation: Conversation): void {
            conversation.setMute(!conversation.muted);

            if (conversation.muted) {
                this.config.vkService.mute.push(conversation.id);
            } else {
                const muteIndex = this.config.vkService.mute.findIndex(id => {
                    return id === conversation.id;
                });

                this.config.vkService.mute.splice(muteIndex, 1);
            }

            return this.config.vkService.save();
        },

        openDeleteConfirmation(conversation: Conversation): void {
            this.confirmation({
                text: "Вы действительно хотите удалить историю сообщений?",

                accept: () => {
                    this.$router.replace("/general")
                        .catch(() => (false));

                    return this.deleteConversation(conversation.id);
                }
            });
        }
    }
};