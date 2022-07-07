import { VK } from "vk-io";
// const vk = new VK();
// vk.updates.on("message_flags")

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
                apiVersion: "5.154",
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

            state.client.updates.on("typing", data => {
                dispatch("conversations/TRIGGER_TYPING", data.fromId);
            });

            state.client.updates.on("friend_activity", data => {
                dispatch("conversations/TRIGGER_ONLINE", data);
            });

            state.client.updates.on("message_flags", data => {
                if (!(data.peerId in state.messages.cache)) {
                    return false;
                }

                const message = state.messages.cache[data.peerId].messages.find(message => {
                    return message.id === data.id;
                });

                if (!message) {
                    return false;
                }

                const enabled = data.subTypes[0] === "message_flags_add";
                if (data.isImportant) {
                    message.important = enabled;
                }
            });

            state.client.updates.start();
        },

        VOTE: async ({ state }, data) => {
            data.poll.can_vote = false;
            data.poll.votes++;

            return await state.client.api.polls.addVote({
                owner_id: data.poll.owner_id,
                poll_id: data.poll.id,
                answer_ids: data.answers.map(answer => answer.id).join(","),
                is_board: Number(data.poll.is_board)
            });
        }
    },

    modules: {
        conversations,
        messages
    }
};