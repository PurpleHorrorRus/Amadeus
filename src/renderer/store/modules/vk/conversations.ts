import { ipcRenderer } from "electron";
import Promise from "bluebird";

import Conversation from "~/instances/Conversations/Convesration";
import Chat from "~/instances/Conversations/Chat";

import { ConversationMessageType } from "~/instances/Types/ConversationMessage";
import ChatUser from "~/instances/Conversations/ChatUser";

import common from "~/plugins/common";
import ProfileGenerator from "~/instances/Generator";

const fields = {
    count: 100,
    filter: "all",
    extended: true,
    fields: "photo_100,online,status,last_seen"
};

export default {
    namespaced: true,

    state: () => ({
        cache: [],
        count: 0
    }),

    actions: {
        FETCH: async ({ dispatch, state, rootState }, offset = 0) => {
            const list = await rootState.vk.client.api.messages.getConversations({
                offset,
                ...fields
            });

            state.count = list.count;
            state.cache = await dispatch("FORMAT", list);
            state.cache.forEach(async conversation => {
                conversation.message = await dispatch("FORMAT_MESSAGE", conversation.message);
            });

            dispatch("UPDATE_ICON");
            return state.cache;
        },

        APPEND: async ({ dispatch, rootState, state }) => {
            if (state.cache.length >= state.count) {
                return false;
            }

            const list = await rootState.vk.client.api.messages.getConversations({
                offset: state.cache.length,
                ...fields
            });

            state.cache = [...state.cache, await dispatch("FORMAT", list)];
            return state.cache;
        },

        FORMAT: async ({ dispatch }, list) => {
            list.items = await dispatch("GET_CHATS", list);

            return await Promise.map(list.items, async item => {
                return await dispatch("FORMAT_ITEM", {
                    item,
                    profiles: list.profiles,
                    groups: list.groups
                });
            });
        },

        FORMAT_ITEM: async ({ rootState }, { item, profiles, groups }) => {
            item.muted = rootState.settings.settings.vk.mute.includes(item.conversation.peer.id);
            return ProfileGenerator.conversationProfileByType(item.conversation.peer.type, item, profiles, groups);
        },

        FORMAT_MESSAGE: async ({ dispatch, rootState }, message) => {
            message.out = message.out || Number(message.from_id === rootState.vk.user.id);

            if (message.action) {
                const action = await dispatch("vk/GET_ACTION_MESSAGE", message, { root: true });
                message.text = action.join(" ");
            }

            return message;
        },

        UPDATE_ONE: async ({ dispatch, state, rootState }, data) => {
            const conversation: Conversation = await dispatch("GET_CONVERSATION_CACHE", data.peerId);

            if (!conversation) {
                return false;
            }

            if (!data.payload.message?.action && conversation.message.id !== data.id) {
                return false;
            }

            const list = await rootState.vk.client.api.messages.getHistory({
                peer_id: data.peerId,
                count: 1,
                extended: 1
            });

            if (conversation.isChat && data.isEvent) {
                const chat = list.conversations[0].chat_settings;
                conversation.updateAvatar(chat.photo?.photo_100);
                conversation.updateTitle(chat.title);
            }

            const message: ConversationMessageType = await dispatch("FORMAT_MESSAGE", list.items[0]);
            conversation.setMessage(message);
            state.cache.sort((a, b) => b.message.date - a.message.date);
            return true;
        },

        GET_CHATS: async ({ rootState }, list) => {
            const chatList = list.items.map((item, index) => {
                return [index, item.conversation.peer.type === "chat", item.conversation.peer.local_id];
            });

            const chatOnly = chatList.filter(item => {
                return item[1];
            });

            const chatProfiles = await rootState.vk.client.api.messages.getChat({
                chat_ids: chatOnly.map(item => item[2]),
                fields: ["photo_100", "screen_name"]
            });

            chatOnly.forEach(item => {
                list.items[item[0]].profile = chatProfiles.find(element => {
                    return element.id === item[2];
                });

                return list.items;
            });

            return list.items;
        },

        EDIT_SYNC: async ({ dispatch }, message) => {
            const conversation: Conversation = await dispatch("GET_CONVERSATION_CACHE", message.peer_id);
            conversation.setMessage(await dispatch("FORMAT_MESSAGE", message));
            return conversation;
        },

        DELETE: async ({ dispatch, rootState }, peer_id) => {
            dispatch("DELETE_SYNC", peer_id);

            return await rootState.vk.client.api.messages.deleteConversation({
                peer_id
            });
        },

        DELETE_SYNC: ({ state }, peer_id) => {
            const index = state.cache.findIndex(chat => {
                return chat.id === peer_id;
            });

            if (~index) {
                state.count--;
                state.cache.splice(index, 1);
                return true;
            }

            return false;
        },

        PLAY_NOTIFICATION: async ({ dispatch, rootState }, id) => {
            const conversation: Conversation = await dispatch("GET_CONVERSATION_CACHE", id);

            if (conversation) {
                if (rootState.settings.settings.vk.disable_notifications || conversation.message.out) {
                    return false;
                }

                const muted = rootState.settings.settings.vk.mute.includes(conversation.id);

                const cantPlayNotification = muted ||
                    rootState.vk.messages.current?.id === conversation.id ||
                    await ipcRenderer.invoke("focused");

                if (cantPlayNotification) {
                    return false;
                }
            }

            const notification = new Audio("./message.mp3");
            notification.volume = 0.2;
            return notification.play();
        },

        GET_CONVERSATION_CACHE: ({ state }, id) => {
            const middle = Math.floor(state.cache.length / 2);
            for (let i = 0, j = state.cache.length - 1; i <= middle && j >= middle; i++, j--) {
                if (state.cache[i].id === id) return state.cache[i];
                if (state.cache[j].id === id) return state.cache[j];
            }

            console.log("Can't find conversation cache", id);
            return null;
        },

        ADD_MESSAGE: async ({ dispatch, state }, data) => {
            const conversation: Conversation = await dispatch("GET_CONVERSATION_CACHE", data.payload.message.peer_id);
            if (!conversation) {
                return await dispatch("FETCH");
            }

            const message: ConversationMessageType = await dispatch("FORMAT_MESSAGE", {
                ...data.payload.message,
                date: Math.floor(Date.now() / 1000),
                text: data.text // Fix unescaped characters in message,
            });

            conversation.addMessage(message);

            if (conversation.isChat) {
                const typingUser: ChatUser = conversation.users.find(user => {
                    return user.id === message.from_id;
                });

                typingUser.stopTyping();
            }

            const conversationIndex = state.cache.findIndex(conversation => {
                return conversation.id === data.peerId;
            });

            if (conversationIndex > 0) {
                state.cache = common.arrayMove(state.cache, conversationIndex, 0);
            }

            if (!message.out) {
                dispatch("UPDATE_ICON");
            }

            return conversation;
        },

        UPDATE_LAST_MESSAGE: async ({ dispatch }, data) => {
            const conversation: Conversation = await dispatch("GET_CONVERSATION_CACHE", data.peerId);

            data.isInbox
                ? conversation.readIn(data.payload.local_id)
                : conversation.readOut(data.payload.local_id);

            dispatch("UPDATE_ICON");
            return true;
        },

        UPDATE_ICON: ({ state }) => {
            const notificationsCount = state.cache.filter(conversation => {
                return conversation.unread > 0;
            }).length;

            return ipcRenderer.send("buildNotificationIcon", notificationsCount);
        },

        TRIGGER_TYPING: async ({ dispatch }, data) => {
            const conversation: Conversation = await dispatch("GET_CONVERSATION_CACHE", data.payload.to_id);
            return conversation?.triggerTyping(data.payload.from_id);
        },

        TRIGGER_ONLINE: async ({ dispatch }, data) => {
            const conversation: Conversation = await dispatch("GET_CONVERSATION_CACHE", data.userId);
            return conversation?.setOnline(data.isOnline, Number(data.isOnline && data.platform < 6));
        },

        RESTRICT: async ({ dispatch }, id: number) => {
            const conversation: Conversation = await dispatch("GET_CONVERSATION_CACHE", id);
            return conversation.restrict();
        },

        ADD_USER: async ({ dispatch }, message) => {
            const conversation: Chat = await dispatch("GET_CONVERSATION_CACHE", message.peer_id);
            const user = await dispatch("vk/GET_PROFILE", message.action.member_id, { root: true });
            return conversation.addUser(user);
        },

        REMOVE_USER: async ({ dispatch, rootState }, message) => {
            const conversation: Chat = await dispatch("GET_CONVERSATION_CACHE", message.peer_id);

            // Эта часть делалась вслепую без возможности протестировать
            if (message.action.member_id === rootState.vk.user.id) {
                conversation.restrict();
            }

            return conversation.removeUser(message.action.member_id);
        }
    }
};