import { VK } from "vk-io";

import conversations from "~/store/modules/vk/conversations";

export default {
    namespaced: true,

    state: () => ({
        client: null,
        user: null
    }),

    actions: {
        AUTH: async ({ state, rootState }) => {
            state.client = new VK({
                token: rootState.config.vk.token
            });

            const [user] =  await state.client.api.users.get({
                user_ids: [rootState.config.vk.user],
                fields: "photo_max"
            });

            state.user = user;
            return state.client;
        }
    },

    modules: {
        conversations
    }
};