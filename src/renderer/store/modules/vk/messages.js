import Promise from "bluebird";
import { FormData } from "formdata-node";
import { fileFromPathSync } from "formdata-node/file-from-path";
import { findLastIndex } from "lodash";

import common from "~/plugins/common";

const fields = {
    count: 20
};

export default {
    namespaced: true,

    state: () => ({
        cache: {},
        current: 0
    }),

    actions: {
        LOAD: async ({ dispatch, state, rootState }, chat) => {
            state.current = chat.id;
            const peer_id = await dispatch("FORMAT_CHAT_ID", chat);

            if (!(peer_id in state.cache)) {
                const history = await rootState.vk.client.api.messages.getHistory({
                    offset: 0,
                    peer_id: peer_id,
                    ...fields
                });

                state.cache[peer_id] = {
                    id: peer_id,
                    count: history.count,
                    messages: history.items.reverse()
                };
            }

            return state.cache[peer_id];
        },

        APPEND: async ({ state, rootState  }, id) => {
            const history = await rootState.vk.client.api.messages.getHistory({
                offset: state.cache[id].messages.length,
                peer_id: id,
                ...fields
            });

            state.cache[id].messages = [...history.items.reverse(), ...state.cache[id].messages];
            return state.cache[id];
        },

        FORMAT_CHAT_ID: (_, chat) => {
            let id = chat.id;

            switch(chat.type) {
                case "chat": {
                    id = Number("200000000" + chat.id);
                    break;
                }

                case "group": case "page": {
                    id = -Math.abs(chat.id);
                    break;
                }

                default: {
                    id = Number(chat.id);
                    break;
                }
            }

            return id;
        },

        ADD_MESSAGE: async ({ state, rootState }, data) => {
            data.payload.message.peer_id = data.isGroup
                ? -Math.abs(data.payload.message.peer_id)
                : data.payload.message.peer_id;

            data.payload.message.random_id = data.payload.message.random_id || common.getRandom(10, 99999999);
            data.payload.message.out = Number(data.payload.message.out 
                || data.payload.message.from_id === rootState.vk.user.id);

            if (data.payload.message.peer_id in state.cache) {
                const response = await rootState.vk.client.api.messages.getById({
                    message_ids: data.payload.message.id
                });

                const message = response.items[0];
                state.cache[message.peer_id].count++;
                if (message.out) {
                    const messageIndex = findLastIndex(state.cache[message.peer_id].messages, msg => {
                        return msg.random_id === message.random_id;
                    });

                    if (~messageIndex) {
                        state.cache[message.peer_id].messages[messageIndex].id = message.id;
                        state.cache[message.peer_id].messages[messageIndex] = message;
                    } else state.cache[data.payload.message.peer_id].messages.push(message);
                } else state.cache[message.peer_id].messages.push(message);

                return state.cache[message.peer_id];
            }

            return false;
        },
        
        SEND: async ({ dispatch, state, rootState }, data) => {
            const message = {
                attachment: [],
                attachments: data.attachments || [],
                date: Math.floor(Date.now() / 1000),
                id: common.getRandom(100000, 999999),
                peer_id: await dispatch("FORMAT_CHAT_ID", data),
                from_id: rootState.vk.user.id,
                random_id: common.getRandom(10, 99999999),
                message: data.message,
                text: data.message,
                out: 1
            };

            state.cache[message.peer_id].messages.push(message);
            dispatch("vk/conversations/ADD_MESSAGE", { payload: { message: {
                ...message,
                peer_id: data.id
            } } }, { root: true });

            if (message.attachments.length > 0) {
                const attachments = await dispatch("UPLOAD", message.attachments);
                message.attachments = attachments.uploaded;
                message.attachment = attachments.ids;
            }

            return await rootState.vk.client.api.messages.send(message);
        },

        UPLOAD: async ({ dispatch, rootState }, attachments) => {
            const { upload_url } = await rootState.vk.client.api.photos.getMessagesUploadServer();
            const uploaded = await Promise.map(attachments, async attachment => {
                attachment.uploading = true;
                const formData = await dispatch("PREPARE_FORMDATA", attachment.path);
                const upload = await rootState.vk.client.upload.upload(upload_url, { formData });
                const [saved] = await rootState.vk.client.api.photos.saveMessagesPhoto(upload);
                saved.type = attachment.type;
                attachment.uploading = false;
                return saved;
            }, { concurrency: 1 });

            return {
                uploaded,
                ids: uploaded.map(attachment => {
                    return `photo${attachment.owner_id}_${attachment.id}`;
                }).join(",")
            };
        },

        PREPARE_FORMDATA: (_, file) => {
            const form = new FormData();
            form.set("file", fileFromPathSync(file));
            return form;
        },

        SET_CURRENT: ({ state }, current) => {
            state.current = current;
            return state.current;
        }
    }
};