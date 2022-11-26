import { VK } from "vk-io";
// const vk = new VK();
// vk.updates.on("")
// vk.upload.video

import conversations from "~/store/modules/vk/conversations";
import messages from "~/store/modules/vk/messages";
import important from "~/store/modules/vk/important";
import search from "~/store/modules/vk/search";
import uploader from "~/store/modules/vk/uploader";

import User from "~/instances/User";
import Group from "~/instances/Group";

import Message from "~/instances/Messages/Message";

export default {
    namespaced: true,

    state: () => ({
        client: null,
        user: null,

        defaults: {
            photo_100: "https://vk.com/images/camera_100.png"
        }
    }),

    mutations: {
        LOGIN_ERROR() {
            this.$router.replace("/login").catch(() => (false));
        }
    },

    actions: {
        AUTH: async ({ dispatch, state }, account) => {
            state.client = new VK({
                apiHeaders: {
                    // eslint-disable-next-line max-len
                    "User-Agent": "VKAndroidApp/7.7-10445 (Android 11; SDK 30; arm64-v8a; Xiaomi M2003J15SC; ru; 2340x1080)"
                },

                apiVersion: "5.134",
                token: account.token
            });

            const [user] = await state.client.api.users.get({
                user_ids: [account.user]
            }).catch(async e => await dispatch("LOGIN_ERROR", e));

            state.user = new User(user);

            state.client = await dispatch("LISTEN");
            await dispatch("conversations/FETCH");
            dispatch("messages/stickers/FETCH");

            return state.client;
        },

        LISTEN: ({ dispatch, state, rootState }) => {
            state.client.updates.on("message_new", async data => {
                const message: Message = await dispatch("messages/PREPARE_MESSAGE", data);

                await Promise.all([
                    dispatch("conversations/ADD_MESSAGE", message),
                    dispatch("messages/ADD_MESSAGE", message)
                ]);

                dispatch("conversations/NOTIFY", message.peer_id);
            });

            state.client.updates.on("messages_read", data => {
                dispatch("conversations/MARK_AS_READ", data);
            });

            state.client.updates.on("typing", data => {
                dispatch("conversations/TRIGGER_TYPING", data);
            });

            state.client.updates.on("friend_online", data => {
                console.log("friend_online", data);
            });

            state.client.updates.on("friend_offline", data => {
                console.log("friend_offline", data);
            });

            state.client.updates.on("friend_activity", data => {
                console.log("friend_activity", data);
                dispatch("conversations/TRIGGER_ONLINE", data);
            });

            state.client.updates.on("message_edit", async data => {
                const message: Message = await dispatch("messages/PREPARE_MESSAGE", data);

                dispatch("conversations/EDIT_SYNC", message);
                dispatch("messages/EDIT_SYNC", message);
            });

            state.client.updates.on("dialog_messages_delete", data => {
                dispatch("conversations/DELETE_SYNC", data.payload.peer_id);
                dispatch("messages/CLEAR", { id: data.payload.peer_id });
            });

            const updateChat = async data => {
                dispatch("conversations/UPDATE_ONE", data);

                const message = await dispatch("messages/PREPARE_MESSAGE", data);
                return await Promise.all([
                    dispatch("conversations/ADD_MESSAGE", message),
                    dispatch("messages/ADD_MESSAGE", message)
                ]);
            };

            state.client.updates.on("chat_photo_update", updateChat);
            state.client.updates.on("chat_photo_remove", updateChat);
            state.client.updates.on("chat_title_update", updateChat);

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
                const message: Message = await dispatch("messages/FIND_MESSAGE", data);

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

        LOGIN_ERROR: ({ commit }, e) => {
            console.log(e);
            commit("LOGIN_ERROR");
            return null;
        },

        GET_PROFILE: async ({ state }, id) => {
            if (id < 0) {
                const data = await state.client.api.groups.getById({
                    group_id: Math.abs(id),
                    fields: "photo_100",
                    extended: 1
                });

                return new Group(data.groups?.[0] || data[0]);
            }

            const data = await state.client.api.users.get({
                user_ids: id,
                fields: "photo_100",
                extended: 1
            });

            return new User(data.profiles?.[0] || data[0]);
        },

        GET_ACTION_MESSAGE: async ({ dispatch }, message: Message) => {
            const conversation = await dispatch("conversations/GET_CONVERSATION_CACHE", message.peer_id);
            const user = conversation.users.find(user => {
                return user.id === message.from_id;
            });

            switch (message.action.type) {
                case "chat_photo_update": {
                    return [
                        user.name,
                        global.$nuxt.$strings.CHAT.ACTIONS.UPDATE_PHOTO
                    ];
                }

                case "chat_photo_remove": {
                    return [
                        user.name,
                        global.$nuxt.$strings.CHAT.ACTIONS.REMOVE_PHOTO
                    ];
                }

                case "chat_invite_user": case "chat_kick_user": {
                    const newUser = await dispatch("GET_PROFILE", message.action.member_id);

                    let actionText = "(not set)";
                    switch (message.action.type) {
                        case "chat_invite_user": actionText = global.$nuxt.$strings.CHAT.ACTIONS.ADD_USER; break;
                        case "chat_kick_user": actionText = global.$nuxt.$strings.CHAT.ACTIONS.KICK_USER; break;
                    }

                    return [
                        user.name,
                        actionText,
                        newUser.name
                    ];
                }

                case "chat_title_update": {
                    return [
                        user.name,
                        global.$nuxt.$strings.CHAT.ACTIONS.RENAME,
                        `"${message.action.text}"`
                    ];
                }
            }

            return [user.name];
        },

        VOTE: async ({ state }, data) => {
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