import { VK } from "vk-io";
// const vk = new VK();
// vk.upload.video

import conversations from "~/store/modules/vk/conversations";
import messages from "~/store/modules/vk/messages";
import important from "~/store/modules/vk/important";
import search from "~/store/modules/vk/search";
import uploader from "~/store/modules/vk/uploader";

import User from "~/instances/User";

export default {
    namespaced: true,

    state: () => ({
        client: null,
        user: null,

        defaults: {
            photo_100: "https://vk.com/images/camera_100.png"
        }
    }),

    actions: {
        AUTH: async ({ dispatch, state }, account) => {
            state.client = new VK({
                apiVersion: "5.154",
                token: account.token
            });

            const [user] = await state.client.api.users.get({
                user_ids: [account.user]
            });

            state.user = new User(user);

            await dispatch("conversations/FETCH");
            await dispatch("LISTEN");

            return state.client;
        },

        LISTEN: ({ dispatch, state, rootState }) => {
            state.client.updates.on("message_new", async data => {
                await Promise.all([
                    dispatch("messages/ADD_MESSAGE", data),
                    dispatch("conversations/ADD_MESSAGE", data)
                ]);
                
                dispatch("conversations/PLAY_NOTIFICATION", data.payload.message.peer_id);
            });

            state.client.updates.on("messages_read", data => {
                dispatch("conversations/UPDATE_LAST_MESSAGE", data);
            });

            state.client.updates.on("typing", data => {
                dispatch("conversations/TRIGGER_TYPING", data);
            });

            state.client.updates.on("friend_activity", data => {
                dispatch("conversations/TRIGGER_ONLINE", data);
            });

            state.client.updates.on("message_edit", async data => {
                data = await dispatch("messages/PREPARE_DATA", data);
                dispatch("conversations/EDIT_SYNC", data.payload.message);

                const response = await state.client.api.messages.getById({
                    message_ids: data.payload.message.id
                });

                return dispatch("messages/SYNC", response.items[0]);
            });

            state.client.updates.on("dialog_messages_delete", data => {
                dispatch("conversations/DELETE_SYNC", data.payload.peer_id);
                dispatch("messages/CLEAR", { id: data.payload.peer_id });
            });

            state.client.updates.on("chat_photo_update", data => {
                dispatch("conversations/UPDATE_ONE", data);
            });

            state.client.updates.on("chat_photo_remove", data => {
                dispatch("conversations/UPDATE_ONE", data);
            });

            state.client.updates.on("chat_title_update", data => { 
                dispatch("conversations/UPDATE_ONE", data);
            });

            state.client.updates.on("chat_invite_user", async data => {
                console.log("chat_invite_user", data);
                dispatch("conversations/ADD_USER", data.payload.message);
                dispatch("conversations/ADD_MESSAGE", data);
                return dispatch("messages/SYNC", data.payload.message);
            });

            state.client.updates.on("chat_kick_user", data => {
                console.log("chat_kick_user", data);
                dispatch("conversations/REMOVE_USER", data.payload.message);
                dispatch("conversations/ADD_MESSAGE", data);
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
            const conversation = await dispatch("conversations/GET_CONVERSATION_CACHE", message.peer_id);
            const user = conversation.users.find(user => {
                return user.id === message.from_id;
            });

            switch (message.action.type) {
                case "chat_photo_update": {
                    return [
                        `${user.first_name} ${user.last_name}`,
                        "обновил фотографию беседы"
                    ];
                }

                case "chat_photo_remove": {
                    return [
                        `${user.first_name} ${user.last_name}`,
                        "удалил фотографию беседы"
                    ];
                }

                case "chat_invite_user": case "chat_kick_user": {
                    const newUser = await dispatch("GET_PROFILE", message.action.member_id);

                    let actionText = "(not set)";
                    switch (message.action.type) {
                        case "chat_invite_user": actionText = "добавил в беседу"; break;
                        case "chat_kick_user": actionText = "исключил из беседы"; break;
                    }

                    return [
                        `${user.first_name} ${user.last_name}`,
                        actionText,
                        newUser.profile.name
                    ];
                }
            }

            return [`${user.first_name} ${user.last_name}`];
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
        important,
        search,
        uploader
    }
};