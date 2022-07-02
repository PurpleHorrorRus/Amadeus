const fields = {
    count: 20
};

export default {
    namespaced: true,

    state: () => ({
        cache: {}
    }),

    actions: {
        LOAD: async ({ state, rootState }, chat) => {
            switch(chat.type) {
                case "chat": {
                    chat.id = Number("200000000" + chat.id);
                    break;
                }

                case "group": {
                    chat.id = -Math.abs(chat.id);
                    break;
                }
            }

            if (!(chat.id in state.cache)) {
                const history = await rootState.vk.client.api.messages.getHistory({
                    offset: 0,
                    peer_id: chat.id,
                    ...fields
                });

                state.cache[chat.id] = {
                    id: chat.id,
                    count: history.count,
                    messages: history.items.reverse()
                };
            }

            return state.cache[chat.id];
        },

        APPEND: async ({ state, rootState  }, id) => {
            const history = await rootState.vk.client.api.messages.getHistory({
                offset: state.cache[id].messages.length,
                peer_id: id,
                ...fields
            });

            state.cache[id].messages = history.items.reverse().concat(state.cache[id].messages);
            return state.cache[id];
        },

        ADD_MESSAGE: async ({ state, rootState }, data) => {
            if (data.payload.message.from_id in state.cache) {
                const response = await rootState.vk.client.api.messages.getById({
                    message_ids: data.payload.message.id
                });

                state.cache[data.payload.message.from_id].count++;
                state.cache[data.payload.message.from_id].messages.push(response.items[0]);
                return state.cache[data.payload.message.from_id];
            }

            return false;
        }
    }
};