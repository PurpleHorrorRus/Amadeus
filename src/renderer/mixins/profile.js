export default {
    computed: {
        showLastSeen() {
            return this.conversation.isUser ||
                this.conversation.isChat;
        }
    },

    methods: {
        externalLink(conversation) {
            return conversation.isUser
                ? `https://vk.com/id${conversation.id}`
                : `https://vk.com/public${Math.abs(conversation.id)}`;
        }
    }
};