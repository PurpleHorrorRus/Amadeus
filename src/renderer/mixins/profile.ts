import Conversation from "~/instances/Conversations/Convesration";

export default {
    computed: {
        showLastSeen(): boolean {
            return this.conversation.isUser ||
                this.conversation.isChat;
        }
    },

    methods: {
        externalLink(conversation: Conversation) {
            return conversation.isUser
                ? `https://vk.com/id${conversation.id}`
                : `https://vk.com/public${Math.abs(conversation.id)}`;
        }
    }
};