import { VK } from "vk-io";
// const vk = new VK();

import conversations from "~/store/modules/vk/conversations";
import messages from "~/store/modules/vk/messages";

export default {
    namespaced: true,

    state: () => ({
        client: null,
        user: null
    }),

    actions: {
        AUTH: async ({ dispatch, state, rootState }) => {
            state.client = new VK({
                token: rootState.config.vk.token
            });

            const [user] =  await state.client.api.users.get({
                user_ids: [rootState.config.vk.user],
                fields: "photo_max"
            });

            state.user = user;
            dispatch("LISTEN");

            return state.client;
        },

        LISTEN: ({ dispatch, state }) => {
            state.client.updates.on("message_new", data => {
                dispatch("messages/ADD_MESSAGE", data);
                dispatch("conversations/ADD_MESSAGE", data);
            });

            state.client.updates.on("messages_read", data => {
                dispatch("conversations/UPDATE_LAST_MESSAGE", data);
            });

            state.client.updates.on("message_typing_state", data => {
                dispatch("conversations/TRIGGER_TYPING", data.fromId);
            });

            state.client.updates.on("friend_activity", data => {
                dispatch("conversations/TRIGGER_ONLINE", data);
            });

            state.client.updates.startPolling();
        }
    },

    modules: {
        conversations,
        messages
    }
};