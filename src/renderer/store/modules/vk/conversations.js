import { debounce } from "lodash";

import common from "~/plugins/common";

const fields = {
    count: 100,
    filter: "all",
    extended: true,
    fields: "photo_100,online,last_seen"
};

export default {
    namespaced: true,

    state: () => ({
        order: [],
        cache: {},
        count: 0
    }),

    actions: {
        FETCH: async ({ dispatch, state, rootState }, offset = 0) => {
            const list = await rootState.vk.client.api.messages.getConversations({
                offset,
                ...fields
            });

            const [cache, order] = await dispatch("FORMAT", list);
            state.count = list.count;
            state.cache = cache;
            state.order = order;

            return state.cache;
        },

        APPEND: async ({ dispatch, rootState, state }) => {
            if (state.order.length >= state.count) {
                return false;
            }

            const list = await rootState.vk.client.api.messages.getConversations({
                offset: state.order.length,
                ...fields
            });

            const [cache, order] = await dispatch("FORMAT", list);
            state.cache = cache;
            state.order = order;

            return state.cache;
        },

        FORMAT: async ({ dispatch }, list) => {
            return await Promise.all([
                dispatch("FORMAT_CACHE", list),
                dispatch("FORMAT_ORDER", list)
            ]);
        },

        FORMAT_CACHE: async ({ dispatch }, list) => {
            list.items = await dispatch("GET_CHATS", list);

            const cache = {};
            list.items.forEach(item => {
                item.conversation.unread_count = item.conversation.unread_count || 0;

                cache[item.conversation.peer.id] = {
                    profile: item.profile 
                        || list.profiles.find(profile => profile.id === item.conversation.peer.id) 
                        || list.groups.find(profile => profile.id === -item.conversation.peer.id),
                    
                    message: item.last_message,
                    information: item.conversation,

                    typing: false,
                    typingDebounce: debounce(function () {
                        this.typing = false; 
                    }, 4000)
                };

                return cache[item.conversation.peer.id];
            });

            return cache;
        },

        FORMAT_ORDER: (_, list) => {
            return list.items.map(item => {
                return item.conversation.peer.id;
            });
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

        ADD_MESSAGE: async ({ dispatch, state, rootState }, data) => {
            if (!(data.payload.message.peer_id in state.cache)) {
                await dispatch("FETCH");
                return false;
            }

            const conversation = state.cache[data.payload.message.peer_id];
            conversation.information.last_message_id = data.payload.message.id;
            conversation.message = {
                ...data.payload.message,
                date: Math.floor(Date.now() / 1000),
                text: data.text // Fix unescaped characters in message
            };

            if (!data.payload.message.out) {
                conversation.information.unread_count++;
            } else if (data.payload.message.peer_id === rootState.vk.user.id) {
                conversation.information.in_read = data.payload.message.id;
                conversation.information.out_read = data.payload.message.id;
            }

            conversation.typing = false;

            const conversationIndex = state.order.indexOf(conversation.information.peer.id);
            state.order = common.arrayMove(state.order, conversationIndex, 0);
            return true;
        },

        UPDATE_LAST_MESSAGE: async ({ state }, data) => {
            const conversation = state.cache[data.payload.peer_id];

            if (data.isInbox) {
                conversation.information.unread_count = 0;
                conversation.information.in_read = data.payload.local_id;
            } else conversation.information.out_read = data.payload.local_id;
            
            return true;
        },

        TRIGGER_TYPING: async ({ state }, id) => {
            const conversation = state.cache[id];
            conversation.typing = true;
            conversation.typingDebounce();
            return true;
        },

        TRIGGER_ONLINE: async ({ state }, data) => {
            const conversation = state.cache[data.userId];
            console.log(data.userId, state.cache, conversation);

            conversation.profile.online = data.isOnline;
            conversation.profile.online_mobile = Number(conversation.profile.online && data.platform < 6);

            if (!conversation.profile.online) {
                conversation.profile.last_seen.time = data.payload.date;
            }

            return true;
            
        }
    }
};