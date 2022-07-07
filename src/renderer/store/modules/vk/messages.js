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
            if (state.cache[id]?.messages.length > fields.count) {
                state.cache[id].messages.splice(0, state.cache[id].messages.length - fields.count - 1);
            }

            return true;
        },

        ADD_MESSAGE: async ({ dispatch, state, rootState }, data) => {
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

                const message = await dispatch("SYNC", response.items[0]);
                state.cache[message.peer_id].count++;
                return state.cache[message.peer_id];
            }

            return false;
        },

        SYNC: ({ state }, message) => {
            const messages = state.cache[message.peer_id].messages;
            const messageIndex = message.random_id > 0 ? findLastIndex(messages, msg => {
                return msg.random_id === message.random_id;
            }) : -1;
            
            if (~messageIndex) {
                const cacheMessage = messages[messageIndex];
                cacheMessage.id = message.id;
                cacheMessage.syncing = 0;
                return Object.assign(cacheMessage, message);
            } else {
                messages.push(message);
                return message;
            }
        },
        
        SEND: async ({ dispatch, rootState }, data) => {
            const toSend = {
                attachment: "",
                peer_id: data.peer_id,
                random_id: common.getRandom(10, 99999999),
                message: data.text,
                reply_to: data.reply_message?.id
            };

            const message = {
                id: common.getRandom(100000, 999999),
                peer_id: toSend.peer_id,
                random_id: toSend.random_id,
                from_id: rootState.vk.user.id,
                date: Math.floor(Date.now() / 1000),
                out: 1,
                syncing: 1,
                ...data
            };

            dispatch("SYNC", message);
            dispatch("vk/conversations/ADD_MESSAGE", { 
                payload: { message },
                text: message.text
            }, { root: true });

            if (message.attachments.length > 0) {
                const attachments = await dispatch("UPLOAD", message.attachments);
                message.attachments = attachments.uploaded;
                toSend.attachment = attachments.ids;
            }

            return await rootState.vk.client.api.messages.send(toSend);
        },

        EDIT: async ({ dispatch, rootState }, message) => {
            const toEdit = {
                attachment: "",
                peer_id: message.peer_id,
                message: message.text,
                message_id: message.id
            };

            message.id = common.getRandom(100000, 999999);
            await dispatch("SYNC", message);
            message.id = toEdit.message_id;

            if (message.attachments.length > 0) {
                const attachments = await dispatch("UPLOAD", message.attachments);
                message.attachments = attachments.uploaded;
                toEdit.attachment = attachments.ids;
            }

            return await rootState.vk.client.api.messages.edit(toEdit);
        },

        UPLOAD: async ({ dispatch, rootState }, attachments) => {
            const { upload_url } = await rootState.vk.client.api.photos.getMessagesUploadServer();
            const uploaded = await Promise.map(attachments, async attachment => {
                if (!("path" in attachment)) {
                    return attachment;
                }

                attachment.uploading = true;
                const formData = await dispatch("PREPARE_FORMDATA", attachment.path);
                const upload = await rootState.vk.client.upload.upload(upload_url, { formData });
                const [saved] = await rootState.vk.client.api.photos.saveMessagesPhoto(upload);
                attachment.uploading = false;

                return {
                    type: attachment.type,
                    [attachment.type]: saved
                };
            }, { concurrency: 1 });

            return {
                uploaded,
                ids: uploaded.map(data => {
                    const attachment = data[data.type];
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
        },

        MARK_IMPORTANT: async ({ rootState }, message) => {
            return await rootState.vk.client.api.messages.markAsImportant({
                message_ids: message.id,
                important: Number(!message.important)
            });
        }
    }
};