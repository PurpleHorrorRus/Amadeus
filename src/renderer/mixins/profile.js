export default {
    computed: {
        showLastSeen() {
            return this.conversation.isUser
                || this.conversation.isChat;
        }
    },

    methods: {
        name(profile) {
            switch(profile.type) {
                case "chat": {
                    return profile.title;
                }

                case "group": case "page": {
                    return profile.name;
                }
                
                default: {
                    return `${profile.first_name} ${profile.last_name}`;
                }
            }
        },

        externalLink(conversation) {
            return conversation.isUser
                ? `https://vk.com/id${conversation.id}`
                : `https://vk.com/public${Math.abs(conversation.id)}`;
        }
    }
};