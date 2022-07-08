const fields = {
    count: 100,
    extended: 1,
    fields: "photo_100"
};

export default {
    namespaced: true,

    state: () => ({}),

    actions: {
        FETCH: async ({ dispatch, rootState }, offset = 0) => {
            const list = await rootState.vk.client.api.messages.getImportantMessages({
                offset,
                ...fields
            });

            return {
                count: list.messages.count,
                conversations: await dispatch("FORMAT", list)
            };
        },

        FORMAT: async (_, list) => {
            return list.messages.items.map(item => {
                return {
                    message: item,
                    information: list.conversations.find(conversation => conversation.peer.id === item.peer_id),
                    
                    profile: list.profiles.find(profile => profile.id === item.from_id)
                        || list.groups.find(group => group.id === item.from_id)
                };
            });
        }
    }
};