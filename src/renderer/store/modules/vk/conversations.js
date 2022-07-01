import Promise from "bluebird";

export default {
    namespaced: true,

    state: () => ({
        list: []
    }),

    actions: {
        FETCH: async ({ dispatch, state, rootState }) => {
            const list = await rootState.vk.client.api.messages.getConversations({
                offset: state.list.length,
                count: 10,
                filter: "all",
                extended: true,
                fields: "photo_100"
            });

            console.log(list);

            state.list = await Promise.map(list.items, async item => {
                return {
                    typing: false,

                    profile: item.conversation.peer.type === "chat"
                        ? await dispatch("GET_CHAT", item.conversation.peer.local_id)
                        : list.profiles.find(profile => profile.id === item.conversation.peer.id) 
                            || list.groups.find(profile => profile.id === -item.conversation.peer.id),

                    message: item.last_message,
                    information: item.conversation
                };
            });

            return state.list;
        },

        GET_CHAT: async ({ rootState }, id) => {
            return await rootState.vk.client.api.messages.getChat({
                chat_id: id,
                fields: "photo_100"
            });
        },

        GET_BY_ID: ({ state }, id) => {
            id = Math.abs(id);
            return state.list.find(item => item.profile.id === id);
        },

        TRIGGER_TYPING: async ({ dispatch }, { id, sequence }) => {
            const conversation = await dispatch("GET_BY_ID", id);
            if (conversation) {
                conversation.typing = sequence;

                if (sequence) {
                    setTimeout(() => dispatch("TRIGGER_TYPING", { 
                        id, 
                        sequence: false 
                    }), 5000);
                }
            }
        }
    }
};