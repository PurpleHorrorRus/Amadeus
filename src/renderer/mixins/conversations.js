import CoreMixin from "~/mixins/core";
import ModalMixin from "~/mixins/modal";

export default {
    mixins: [CoreMixin, ModalMixin],

    methods: {
        async readConversation(conversation) {
            conversation.information.unread_count = 0;
            return await this.client.api.messages.markAsRead({
                peer_id: conversation.id,
                start_message_id: conversation.message.id
            });
        },

        profileInMute(conversation) {
            return this.settings.vk.mute.includes(conversation.id);
        },

        turnMute(conversation) {
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

        openDeleteConfirmation(conversation) {
            this.confirmation({
                text: "Вы действительно хотите удалить историю сообщений?",
                accept: () => {
                    this.$router.replace("/general").catch(() => {});
                    this.deleteConversation(conversation.id);
                }
            });
        }
    }
};