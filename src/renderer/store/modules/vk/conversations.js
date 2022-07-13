import { ipcRenderer  } from "electron";
import Promise from "bluebird";
import { debounce } from "lodash";

import common from "~/plugins/common";

const fields = {
    count: 100,
    filter: "all",
    extended: true,
    fields: "photo_100,online,status,last_seen"
};

const mentionRegex = /\[id(.*?)\|@(.*?)\]/;

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
            item.conversation.unread_count = item.conversation.unread_count || 0;

            const profile = item.profile 
                || profiles.find(profile => profile.id === item.conversation.peer.id) 
                || groups.find(profile => profile.id === -item.conversation.peer.id);

            profile.photo_100 = profile.photo_100 ||
                rootState.vk.defaults.photo_100;

            return {
                ...item.conversation.peer,

                isUser: item.conversation.peer.type === "user",
                isGroup: item.conversation.peer.type === "group" || item.conversation.peer.type === "page",
                isChat: item.conversation.peer.type === "chat", 

                profile,
                    
                message: item.last_message,
                information: item.conversation,

                pinned: item.conversation.sort_id.major_id !== 0,
                muted: rootState.settings.settings.vk.mute.includes(item.conversation.peer.id),
                mention: mentionRegex.test(item.last_message.text),

                typing: {
                    enable: false,
                    names: [],
                    debounce: debounce(function () {
                        this.enable = false;
                        this.names = [];
                    }, 6000)
                }
            };
        },

        FORMAT_MESSAGE: async ({ dispatch }, message) => {
            if (message.action) {
                const action = await dispatch("vk/GET_ACTION_MESSAGE", message, { root: true });
                message.text = action.join(" ");
            }

            return message;
        },

        UPDATE_ONE: async ({ dispatch, state, rootState }, data) => {
            const conversation = await dispatch("GET_CONVERSATION_CACHE", data.peerId);

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

            if (conversation.isChat) {
                list.items[0] = {
                    conversation:list.conversations.find(conversation => {
                        return conversation.peer.id === list.items[0].peer_id;
                    }),

                    last_message: list.items[0]
                };

                const [updated] = await dispatch("FORMAT", list);
                Object.assign(conversation, updated);
            }

            conversation.message = await dispatch("FORMAT_MESSAGE", list.items[0]);
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
                fields: ["photo_100"]
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
            const conversation = await dispatch("GET_CONVERSATION_CACHE", message.peer_id);
            conversation.message = await dispatch("FORMAT_MESSAGE", message);
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
            const conversation = await dispatch("GET_CONVERSATION_CACHE", id);

            if (conversation) {
                if (rootState.settings.settings.vk.disable_notifications || conversation.message.out) {
                    return false;
                }

                const muted = rootState.settings.settings.vk.mute.some(id => {
                    return id === conversation.id;
                });

                const cantPlayNotification = muted
                    || rootState.vk.messages.current?.id === conversation.id
                    || await ipcRenderer.invoke("focused");

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
            for (let i = 0, j = state.cache.length - 1; i < middle && j > middle; i++, j--) {
                if (state.cache[i].id === id) return state.cache[i];
                if (state.cache[j].id === id) return state.cache[j];
            }

            return null;
        },

        ADD_MESSAGE: async ({ dispatch, state, rootState }, data) => {
            const conversation = await dispatch("GET_CONVERSATION_CACHE", data.payload.message.peer_id);
            if (!conversation) {
                return await dispatch("FETCH");
            }

            conversation.information.last_message_id = data.payload.message.id;
            conversation.message = await dispatch("FORMAT_MESSAGE", {
                ...data.payload.message,
                date: Math.floor(Date.now() / 1000),
                text: data.text // Fix unescaped characters in message,
            });

            if (!data.payload.message.out) {
                conversation.information.unread_count++;
            } else if (data.payload.message.peer_id === rootState.vk.user.id) {
                conversation.information.in_read = data.payload.message.id;
                conversation.information.out_read = data.payload.message.id;
            }
            
            conversation.mention = conversation.mention || mentionRegex.test(data.text);
            if (conversation.isChat) {
                const typingUserIndex = conversation.typing.names.findIndex(typingUser => {
                    return typingUser.id === conversation.message.from_id;
                });

                conversation.typing.names.splice(typingUserIndex, 1);
                if (conversation.typing.names.length === 0) {
                    conversation.typing.enable = false;
                }
            } else conversation.typing.enable = false;

            const conversationIndex = state.cache.findIndex(conversation => {
                return conversation.id === data.peerId;
            });

            if (conversationIndex > 0) {
                state.cache = common.arrayMove(state.cache, conversationIndex, 0);
            }

            return conversation;
        },

        UPDATE_LAST_MESSAGE: async ({ dispatch }, data) => {
            const conversation = await dispatch("GET_CONVERSATION_CACHE", data.peerId);

            if (data.isInbox) {
                conversation.information.unread_count = 0;
                conversation.information.in_read = data.payload.local_id;
            } else conversation.information.out_read = data.payload.local_id;
            
            return true;
        },

        TRIGGER_TYPING: async ({ dispatch }, data) => {
            const conversation = data.isChat
                ? await dispatch("TRIGGER_TYPING_CHAT", data)
                : await dispatch("GET_CONVERSATION_CACHE", data.payload.to_id);

            if (!conversation) {
                return false;
            }

            conversation.typing.enable = true;
            conversation.typing.debounce();
            return true;
        },

        TRIGGER_TYPING_CHAT: async ({ dispatch }, data) => {
            const conversation = await dispatch("GET_CONVERSATION_CACHE", data.payload.to_id);

            const user = conversation.profile.users.find(user => {
                return user.id === data.payload.from_id;
            });

            const isUserTyping = conversation.typing.names.some(typingUser => {
                return typingUser.id === user.id;
            });

            if (!isUserTyping) {
                user.debounce = debounce(() => {
                    const typingUserIndex = conversation.typing.names.findIndex(typingUser => {
                        return typingUser.id === user.id;
                    });

                    conversation.typing.names.splice(typingUserIndex, 1);
                }, 6000);

                conversation.typing.names.push(user);
                user.debounce();
            } else user.debounce();

            return conversation;
        },

        TRIGGER_ONLINE: async ({ dispatch }, data) => {
            const conversation = await dispatch("GET_CONVERSATION_CACHE", data.userId);
            conversation.profile.online = data.isOnline;
            conversation.profile.online_mobile = Number(conversation.profile.online && data.platform < 6);
            return true;
        },

        ADD_USER: async ({ dispatch }, message) => {
            const conversation = await dispatch("GET_CONVERSATION_CACHE", message.peer_id);
            const user = await dispatch("vk/GET_PROFILE", message.action.member_id, { root: true });
            conversation.profile.users.push(user.profile);
            return true;
        },

        REMOVE_USER: async ({ dispatch }, message) => {
            const conversation = await dispatch("GET_CONVERSATION_CACHE", message.peer_id);
            const userIndex = conversation.profile.users.findIndex(user => user.id === message.action.member_id);
            conversation.profile.users.splice(userIndex, 1);
            return true;
        }
    }
};