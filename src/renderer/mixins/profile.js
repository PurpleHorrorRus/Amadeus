export default {
    methods: {
        name(profile) {
            switch(profile.type) {
                case "chat": {
                    return profile.title;
                }

                case "group": {
                    return profile.name;
                }
                
                default: {
                    return `${profile.first_name} ${profile.last_name}`;
                }
            }
        }
    }
};