import common from "~/plugins/common";

const fields = {
    count: 20
};

export default {
    namespaced: true,

    state: () => ({
        cache: {},
        current: 0
    }),

    actions: {
        LOAD: async ({ dispatch, state, rootState }, chat) => {
            state.current = chat.id;
            const peer_id = await dispatch("FORMAT_CHAT_ID", chat);

            if (!(peer_id in state.cache)) {
                const history = await rootState.vk.client.api.messages.getHistory({
                    offset: 0,
                    peer_id: peer_id,
                    ...fields
                });

                state.cache[peer_id] = {
                    id: peer_id,
                    count: history.count,
                    messages: history.items.reverse()
                };
            }

            return state.cache[peer_id];
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

        FORMAT_CHAT_ID: (_, chat) => {
            let id = chat.id;

            switch(chat.type) {
                case "chat": {
                    id = Number("200000000" + chat.id);
                    break;
                }

                case "group": {
                    id = -Math.abs(chat.id);
                    break;
                }

                default: {
                    id = Number(chat.id);
                    break;
                }
            }

            return id;
        },

        ADD_MESSAGE: async ({ state, rootState }, data) => {
            const id = data.payload.message.from_id;

            data.payload.message.out = data.payload.message.out 
                || data.payload.message.from_id === rootState.vk.user.id;

            if (id in state.cache) {
                const response = await rootState.vk.client.api.messages.getById({
                    message_ids: data.payload.message.id
                });

                state.cache[id].count++;
                if (data.payload.message.out) {
                    const messageIndex = state.cache[id].messages.findIndex(message => {
                        return message.random_id === data.payload.message.random_id;
                    });

                    ~messageIndex
                        ? state.cache[id].messages[messageIndex] = response.items[0]
                        : state.cache[id].messages.push(response.items[0]);
                } else {
                    state.cache[id].messages.push(response.items[0]);
                }

                return state.cache[id];
            }

            return false;
        },
        
        SEND: async ({ dispatch, state, rootState }, data) => {
            const peer_id = await dispatch("FORMAT_CHAT_ID", data);

            const message = {
                attachments: [],
                date: Math.floor(Date.now() / 1000),
                peer_id,
                from_id: rootState.vk.user.id,
                random_id: common.getRandom(10, 99999999),
                message: data.message,
                text: data.message,
                out: 1
            };

            if (peer_id in state.cache) {
                state.cache[peer_id].messages.push(message);
            }

            return await rootState.vk.client.api.messages.send(message);
        },

        SET_CURRENT: ({ state }, current) => {
            state.current = current;
            return state.current;
        }
    }
};