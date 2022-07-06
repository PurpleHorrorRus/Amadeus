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
        LOAD: async ({ state, rootState }, id) => {
            state.current = id;

            if (!(id in state.cache)) {
                const history = await rootState.vk.client.api.messages.getHistory({
                    offset: 0,
                    peer_id: id,
                    ...fields
                });

                state.cache[id] = {
                    id: id,
                    count: history.count,
                    messages: history.items.reverse()
                };
            }

            return state.cache[id];
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

        FLUSH: ({ state }, id) => {
            state.cache[id].messages.splice(0, state.cache[id].messages.length - fields.count - 1);
            return true;
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
                peer_id: state.current,
                from_id: rootState.vk.user.id,
                random_id: common.getRandom(10, 99999999),
                message: data.message,
                text: data.message,
                out: 1,
                fast: 1
            };

            state.cache[message.peer_id].messages.push(message);
            dispatch("vk/conversations/ADD_MESSAGE", { 
                text: message.text,
                payload: { message: {
                    ...message,
                    peer_id: data.id
                } } 
            }, { root: true });

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