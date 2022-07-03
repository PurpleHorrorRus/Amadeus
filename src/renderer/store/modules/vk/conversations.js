import Promise from "bluebird";

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
        list: [],
        count: 0
    }),

    actions: {
        FETCH: async ({ dispatch, state, rootState }, offset = 0) => {
            const list = await rootState.vk.client.api.messages.getConversations({
                offset,
                ...fields
            });

            state.count = list.count;
            state.list = await dispatch("FORMAT", list); 
            return state.list;
        },

        APPEND: async ({ dispatch, rootState, state }) => {
            if (state.list.length >= state.count) {
                return false;
            }

            const list = await rootState.vk.client.api.messages.getConversations({
                offset: state.list.length,
                ...fields
            });

            state.list = state.list.concat(await dispatch("FORMAT", list)); 
            return state.list;
        },

        FORMAT: async ({ dispatch }, list) => {
            list.items = await dispatch("GET_CHATS", list);

            return await Promise.map(list.items, async item => {
                return {
                    profile: item.profile 
                        || list.profiles.find(profile => profile.id === item.conversation.peer.id) 
                        || list.groups.find(profile => profile.id === -item.conversation.peer.id),
                    
                    message: item.last_message,
                    information: item.conversation,

                    typing: false
                };
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

        GET_BY_ID: ({ state }, id) => {
            id = Math.abs(id);
            return state.list.find(item => item.profile.id === id);
        },

        GET_INDEX_BY_ID: ({ state }, id) => {
            id = Math.abs(id);
            return state.list.findIndex(item => item.profile.id === id);
        },

        ADD_MESSAGE: async ({ dispatch, state }, data) => {
            data.payload.message.peer_id = Math.abs(data.payload.message.peer_id);

            const conversationIndex = await dispatch("GET_INDEX_BY_ID", data.payload.message.peer_id);
            if (!~conversationIndex) {
                await dispatch("FETCH");
                return false;
            }

            const conversation = state.list[conversationIndex];
            
            const message = data.payload.message;
            conversation.message.id = message.id;
            conversation.message.date = message.date;
            conversation.message.attachments = message.attachments;
            conversation.message.text = message.text;
            conversation.message.out = message.out;

            conversation.information.last_message_id = message.id;

            dispatch("TRIGGER_TYPING", {
                id: data.payload.message.from_id,
                sequence: false
            });

            state.list = common.arrayMove(state.list, conversationIndex, 0);
            return true;
        },

        UPDATE_LAST_MESSAGE: async ({ dispatch }, data) => {
            data.payload.peer_id = Math.abs(data.payload.peer_id);

            const conversation = await dispatch("GET_BY_ID", data.payload.peer_id);
            data.isInbox
                ? conversation.information.in_read = data.payload.local_id
                : conversation.information.out_read = data.payload.local_id;
            
            return true;
        },

        TRIGGER_TYPING: async ({ dispatch }, { id, sequence }) => {
            const conversation = await dispatch("GET_BY_ID", id);
            conversation.typing = sequence;

            if (sequence) {
                setTimeout(() => dispatch("TRIGGER_TYPING", { 
                    id, 
                    sequence: false 
                }), 5000);
            }
        },

        TRIGGER_ONLINE: async ({ dispatch }, data) => {
            const conversation = await dispatch("GET_BY_ID", data.userId);
            if (conversation) {
                conversation.profile.online = data.isOnline;
                conversation.profile.online_mobile = Number(conversation.profile.online && data.platform < 6);
                return true;
            }

            return false;
            
        }
    }
};