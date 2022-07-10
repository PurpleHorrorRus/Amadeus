import { VK } from "vk-io";
// const vk = new VK();
// vk.updates.on("chat_kick_user");

import conversations from "~/store/modules/vk/conversations";
import messages from "~/store/modules/vk/messages";
import important from "~/store/modules/vk/important";

export default {
    namespaced: true,

    state: () => ({
        client: null,
        user: null
    }),

    actions: {
        AUTH: async ({ dispatch, state }, account) => {
            state.client = new VK({
                apiVersion: "5.154",
                token: account.token
            });

            const [user] =  await state.client.api.users.get({
                user_ids: [account.user],
                fields: "photo_max"
            });

            state.user = user;

            await dispatch("conversations/FETCH");
            await dispatch("LISTEN");

            return state.client;
        },

        LISTEN: ({ dispatch, state, rootState }) => {
            state.client.updates.on("message_new", data => {
                dispatch("messages/ADD_MESSAGE", data);
                dispatch("conversations/ADD_MESSAGE", data);
            });

            state.client.updates.on("messages_read", data => {
                dispatch("conversations/UPDATE_LAST_MESSAGE", data);
            });

            state.client.updates.on("typing", data => {
                console.log("TYPING", data);
                dispatch("conversations/TRIGGER_TYPING", data);
            });

            state.client.updates.on("friend_activity", data => {
                dispatch("conversations/TRIGGER_ONLINE", data);
            });

            state.client.updates.on("message_edit", async data => {
                data = await dispatch("messages/PREPARE_DATA", data);
                dispatch("conversations/UPDATE_ONE", data);

                const response = await state.client.api.messages.getById({
                    message_ids: data.payload.message.id
                });

                return dispatch("messages/SYNC", response.items[0]);
            });

            state.client.updates.on("chat_invite_user", async data => {
                console.log("chat_invite_user", data);
                dispatch("conversations/ADD_USER", data.payload.message);
                dispatch("conversations/ADD_MESSAGE", data.payload.message);
                return dispatch("messages/SYNC", data.payload.message);
            });

            state.client.updates.on("chat_kick_user", data => {
                console.log("chat_kick_user", data);
                dispatch("conversations/REMOVE_USER", data.payload.message);
                dispatch("conversations/ADD_MESSAGE", data.payload.message);
                return dispatch("messages/SYNC", data.payload.message);
            });

            state.client.updates.on("message_flags", async data => {
                const message = await dispatch("messages/FIND_MESSAGE", data);

                if (data.isDeleted) {
                    if (message) {
                        if (data.message?.subTypes[0] === "message_new") { // Restoring
                            await dispatch("messages/SYNC_RESTORE", message);
                        } else if (data.isDeletedForAll || message.peer_id === rootState.vk.user.id) {
                            await dispatch("messages/SYNC_DELETE", message);
                        }
                    }

                    return await dispatch("conversations/UPDATE_ONE", data);
                }

                if (!message) {
                    return false;
                }

                const enabled = data.subTypes[0] === "message_flags_add";
                if (data.isImportant) {
                    message.important = enabled;
                    return true;
                }

                return enabled;
            });

            state.client.updates.start();
            return state.client;
        },

        GET_PROFILE: async ({ state }, id) => {
            if (id < 0) {
                const data = await state.client.api.groups.getById({
                    group_id: Math.abs(id),
                    fields: "photo_100",
                    extended: 1
                });
    
                return {
                    type: "group",
                    profile: data.groups?.[0] || data[0]
                };
            }

            const data = await state.client.api.users.get({
                user_ids: id,
                fields: "photo_100",
                extended: 1
            });

            const user = data.profiles?.[0] || data[0];
            user.name = `${user.first_name} ${user.last_name}`;
            return {
                type: "user",
                profile: user
            };
        },

        GET_ACTION_MESSAGE: async ({ dispatch }, message) => {
            const [conversation, newUser] = await Promise.all([
                dispatch("conversations/GET_CONVERSATION_CACHE", message.peer_id),
                dispatch("GET_PROFILE", message.action.member_id)
            ]);

            const invited = conversation.profile.users.find(user => {
                return user.id === message.from_id;
            });

            let actionText = "(not set)";
            switch(message.action.type) {
                case "chat_invite_user": actionText = "добавил в беседу"; break;
                case "chat_kick_user": actionText = "исключил из беседы"; break;
            }

            return [
                `${invited.first_name} ${invited.last_name}`,
                actionText,
                newUser.profile.name
            ];
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
        messages,
        important
    }
};