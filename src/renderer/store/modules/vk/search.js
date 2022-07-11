const fields = {
    count: 100,
    extended: 1,
    fields: "photo_100"
};

export default {
    namespaced: true,

    state: () => ({}),

    actions: {
        FETCH: async ({ dispatch, rootState }, data) => {
            const list = await rootState.vk.client.api.messages.search({
                q: data.q,
                offset: data.offset,
                ...fields
            });

            return {
                count: list.count,
                conversations: await dispatch("FORMAT", list)
            };
        },

        FORMAT: async (_, list) => {
            return list.items.map(item => {
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