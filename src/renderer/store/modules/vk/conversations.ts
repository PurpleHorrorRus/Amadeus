import Promise from "bluebird";

import {
    MessagesGetConversationsByIdParams,
    MessagesGetConversationsParams
} from "vk-io/lib/api/schemas/params";

import {
    MessagesGetConversationsByIdExtendedResponse,
    MessagesGetConversationsResponse,
    MessagesGetHistoryResponse
} from "vk-io/lib/api/schemas/responses";

import Conversation from "~/instances/Conversations/Convesration";
import Chat from "~/instances/Conversations/Chat";

import ProfileGenerator from "~/instances/Generator";
import ChatUser from "~/instances/Conversations/ChatUser";
import common from "~/plugins/common";
import Message from "~/instances/Messages/Message";

const fields: MessagesGetConversationsParams = {
    extended: 1,
    count: 100,
    filter: "all",
    fields: ["photo_100", "online", "status", "last_seen"]
};

export default {
    namespaced: true,

    state: () => ({
        cache: [],
        count: 0
    }),

    actions: {
        FETCH: async ({ dispatch, state, rootState }, offset = 0) => {
            const list: MessagesGetConversationsResponse = await rootState.vk.client.api.messages.getConversations({
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
            item.muted = rootState.config.vkService.mute.includes(item.conversation.peer.id);

            return ProfileGenerator.conversationProfileByType(
                item.conversation.peer.type,
                item, profiles, groups
            );
        },

        FORMAT_MESSAGE: async ({ dispatch, rootState }, message: Message) => {
            message.out = message.out || message.from_id === rootState.vk.user.id;

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

            const list: MessagesGetHistoryResponse = await rootState.vk.client.api.messages.getHistory({
                peer_id: data.peerId,
                count: 1,
                extended: 1
            });

            if (conversation.isChat && data.isEvent) {
                const chat = list.conversations[0].chat_settings;
                conversation.updateAvatar(chat.photo?.photo_100);
                conversation.updateTitle(chat.title);
            }

            const latestMessage: Message = new Message(list.items[0]);
            conversation.setMessage(latestMessage);

            if (!conversation.pinned) {
                state.cache.sort((a: Conversation, b: Conversation) => {
                    return b.message.date - a.message.date;
                });
            }

            return true;
        },

        GET_CHATS: async ({ rootState }, list) => {
            const chatList = list.items.map((item, index) => {
                return [index, item.conversation.peer.type === "chat", item.conversation.peer.local_id];
            });

            const chatOnly = chatList.filter(item => {
                return item[1];
            });

            if (chatOnly.length === 0) {
                return list.items;
            }

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

        EDIT_SYNC: async ({ dispatch }, message: Message) => {
            const conversation: Conversation = await dispatch("GET_CONVERSATION_CACHE", message.peer_id);
            conversation.setMessage(message);
            return conversation;
        },

        DELETE: async ({ dispatch, rootState }, peer_id) => {
            dispatch("DELETE_SYNC", peer_id);

            return await rootState.vk.client.api.messages.deleteConversation({
                peer_id
            });
        },

        DELETE_SYNC: ({ dispatch, state }, peer_id) => {
            const index = state.cache.findIndex(chat => {
                return chat.id === peer_id;
            });

            if (~index) {
                state.count--;
                state.cache.splice(index, 1);
                dispatch("UPDATE_ICON");
                return true;
            }

            return false;
        },

        NOTIFY: async ({ dispatch, rootState }, id) => {
            /*
                Не проигрывть звук оповещения, если:
                1. Включен глобальный мут
                2. Сообщение является исходящим
                3. Конкретный чат в муте
                4. Окно в фокусе? Если да, проигрывать, только если открыт другой чат
            */

            const conversation: Conversation = await dispatch("GET_CONVERSATION_CACHE", id);

            if (!rootState.config.vkService.notifications || conversation.message.out) {
                return false;
            }

            if (rootState.config.vkService.mute.includes(conversation.id)) {
                return false;
            }

            const focused = await global.$nuxt.$ipc.invoke("focused");
            if (focused && rootState.vk.messages.current?.id === conversation.id) {
                return false;
            }

            if (rootState.config.general.sound.enable) {
                const notification = new Audio(rootState.config.general.sound.file || "./message.mp3");
                notification.volume = 0.4;
                notification.play();
            }

            if (rootState.config.general.notifications) {
                global.$nuxt.$ipc.send("notifierMessage", {
                    ...conversation,

                    profile: {
                        ...conversation.profile,
                        avatar: conversation.avatar,
                        name: conversation.name
                    }
                });
            }

            return true;
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

        GET_NEXT: ({ state, rootState }, add = 1) => {
            const currentIndex = rootState.vk.messages.current
                ? state.cache.findIndex(conversation => {
                    return conversation.id === rootState.vk.messages.current.id;
                })
                : -1;

            if (add >= 0) {
                const nextIndex = currentIndex + add < state.cache.length - 1
                    ? currentIndex + add
                    : 0;

                return state.cache[nextIndex];
            }

            const prevIndex = currentIndex + add > -1
                ? currentIndex + add
                : state.cache.length - 1;

            return state.cache[prevIndex];
        },

        ADD_CONVERSATION: async ({ dispatch, state, rootState }, message: Message) => {
            const params: MessagesGetConversationsByIdParams = {
                peer_ids: message.peer_id,
                ...fields
            };

            const response: MessagesGetConversationsByIdExtendedResponse =
                await rootState.vk.client.api.messages.getConversationsById(params);

            const list: MessagesGetConversationsResponse = {
                count: state.count + 1,

                items: [{
                    conversation: {
                        ...response.items[0],
                        unread_count: 1
                    },

                    last_message: message
                }],

                groups: response.groups,
                profiles: response.profiles
            };

            const [conversation] = await dispatch("FORMAT", list);
            conversation.message = await dispatch("FORMAT_MESSAGE", conversation.message);
            return conversation;
        },

        ADD_MESSAGE: async ({ dispatch, state }, message: Message) => {
            message = await dispatch("FORMAT_MESSAGE", message);

            let conversation: Conversation = await dispatch("GET_CONVERSATION_CACHE", message.peer_id);

            if (!conversation) {
                conversation = await dispatch("ADD_CONVERSATION", message);
                state.count++;
                state.cache.unshift(conversation);
            } else {
                conversation.addMessage(message);

                if (conversation.isChat) {
                    const typingUser: ChatUser = conversation.users.find(user => {
                        return user.id === message.from_id;
                    });

                    typingUser?.stopTyping();
                }

                const conversationIndex = state.cache.findIndex(conversation => {
                    return conversation.id === message.peer_id;
                });

                if (conversationIndex > 0) {
                    state.cache = common.arrayMove(state.cache, conversationIndex, 0);
                }
            }

            if (!conversation.message.out) {
                dispatch("UPDATE_ICON");
            }

            return conversation;
        },

        MARK_AS_READ: async ({ dispatch }, data) => {
            const conversation: Conversation
                = await dispatch("GET_CONVERSATION_CACHE", data.peerId);

            if (conversation) {
                data.isInbox
                    ? conversation.readIn(data.localId)
                    : conversation.readOut(data.localId);
            }

            dispatch("UPDATE_ICON");
            return true;
        },

        UPDATE_ICON: ({ state }) => {
            const notificationsCount = state.cache.filter(conversation => {
                return conversation.unread > 0;
            }).length;

            return global.$nuxt.$ipc.send("buildNotificationIcon", notificationsCount);
        },

        TRIGGER_TYPING: async ({ dispatch }, data) => {
            const conversation: Conversation = await dispatch("GET_CONVERSATION_CACHE", data.payload.to_id);
            return conversation?.triggerTyping(data.payload.from_id);
        },

        TRIGGER_ONLINE: async ({ dispatch }, data) => {
            console.log("TRIGGER_ONLINE", data);

            const conversation: Conversation = await dispatch("GET_CONVERSATION_CACHE", data.userId);
            return conversation?.setOnline(data.isOnline, data.platform);
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