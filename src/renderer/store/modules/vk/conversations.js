import { debounce } from "lodash";

import common from "~/plugins/common";

const fields = {
    count: 100,
    filter: "all",
    extended: true,
    fields: "photo_100,online,last_seen"
};

const mentionRegex = /\[id(.*?)\|@(.*?)\]/;

export default {
    namespaced: true,

    state: () => ({
        pinned: {
            order: [],
            conversations: {}
        },

        cache: {
            order: [],
            conversations: {}
        },
       
        count: 0
    }),

    actions: {
        FETCH: async ({ dispatch, state, rootState }, offset = 0) => {
            const list = await rootState.vk.client.api.messages.getConversations({
                offset,
                ...fields
            });
            
            state.count = list.count;
            return await dispatch("FORMAT", list);
        },

        APPEND: async ({ dispatch, rootState, state }) => {
            const total = state.cache.order.length + state.pinned.order.length;
            if (total >= state.count) {
                return false;
            }

            const list = await rootState.vk.client.api.messages.getConversations({
                offset: total,
                ...fields
            });

            return await dispatch("FORMAT", list);
        },

        FORMAT: async ({ dispatch, state }, list) => {
            list.items = await dispatch("GET_CHATS", list);

            for (let item of list.items) {
                item = await dispatch("FORMAT_ITEM", {
                    item,
                    profiles: list.profiles,
                    groups: list.groups
                });

                const pushObject = !item.pinned ? state.cache : state.pinned;
                pushObject.conversations[item.information.peer.id] = item;
                pushObject.order.push(item.information.peer.id);
            }

            return true;
        },

        FORMAT_ITEM: (_, { item, profiles, groups }) => {
            item.conversation.unread_count = item.conversation.unread_count || 0;

            return {
                profile: item.profile 
                        || profiles.find(profile => profile.id === item.conversation.peer.id) 
                        || groups.find(profile => profile.id === -item.conversation.peer.id),
                    
                message: item.last_message,
                information: item.conversation,

                pinned: item.conversation.sort_id.major_id !== 0,
                mention: mentionRegex.test(item.last_message.text),

                typing: false,
                typingDebounce: debounce(function () {
                    this.typing = false; 
                }, 6000)
            };
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

        GET_CONVERSATION_CACHE: ({ state }, id) => {
            return state.cache.conversations[id] 
                || state.pinned.conversations[id];
        },

        ADD_MESSAGE: async ({ dispatch, state, rootState }, data) => {
            const conversation = await dispatch("GET_CONVERSATION_CACHE", data.payload.message.peer_id);
            if (!conversation) {
                return await dispatch("FETCH");
            }

            console.log(conversation.pinned);
            conversation.information.last_message_id = data.payload.message.id;
            conversation.message = {
                ...data.payload.message,
                date: Math.floor(Date.now() / 1000),
                text: data.text // Fix unescaped characters in message,
            };

            if (!data.payload.message.out) {
                conversation.information.unread_count++;
            } else if (data.payload.message.peer_id === rootState.vk.user.id) {
                conversation.information.in_read = data.payload.message.id;
                conversation.information.out_read = data.payload.message.id;
            }
            
            conversation.mention = conversation.mention || mentionRegex.test(data.text);
            conversation.typing = false;

            if (!conversation.pinned) {
                const conversationIndex = state.cache.order.indexOf(conversation.information.peer.id);
                if (conversationIndex !== 0) {
                    state.cache.order = common.arrayMove(state.cache.order, conversationIndex, 0);
                }
            } else state.pinned.order = [...state.pinned.order]; // Trigger render

            return conversation;
        },

        UPDATE_LAST_MESSAGE: async ({ dispatch }, data) => {
            const peer_id = data.payload.peer_id;
            const conversation = await dispatch("GET_CONVERSATION_CACHE", peer_id);
            if (!conversation) {
                return false;
            }

            if (data.isInbox) {
                conversation.information.unread_count = 0;
                conversation.information.in_read = data.payload.local_id;
            } else conversation.information.out_read = data.payload.local_id;
            
            return true;
        },

        TRIGGER_TYPING: async ({ dispatch }, id) => {
            const conversation = await dispatch("GET_CONVERSATION_CACHE", id);
            conversation.typing = true;
            conversation.typingDebounce();
            return true;
        },

        TRIGGER_ONLINE: async ({ dispatch }, data) => {
            const conversation = await dispatch("GET_CONVERSATION_CACHE", data.userId);
            if (!conversation) {
                return false;
            }

            conversation.profile.online = data.isOnline;
            conversation.profile.online_mobile = Number(conversation.profile.online && data.platform < 6);

            if (!conversation.profile.online) {
                conversation.profile.last_seen.time = data.payload.date;
            }

            return true;
            
        }
    }
};