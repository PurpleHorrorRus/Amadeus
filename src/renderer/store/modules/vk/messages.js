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
            return true;
        },

        ADD_MESSAGE: ({ state }, data) => {
            const id = data.payload.message.from_id;
            if (id in state.cache) {
                state.cache[id].count++;
                state.cache[id].messages.push(data.payload.message);
                return true;
            }

            return false;
        }
    }
};