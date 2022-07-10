export default {
    computed: {
        showLastSeen() {
            return (this.profile.last_seen || this.profile.online)
                && this.profile.type !== "group"
                && this.profile.type !== "chat";
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
        }
    }
};