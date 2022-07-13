import { ipcRenderer } from "electron";
import Promise from "bluebird";
import { FormData } from "formdata-node";
import { fileFromPathSync } from "formdata-node/file-from-path";
import { findLastIndex } from "lodash";
import fs from "fs-extra";

import common from "~/plugins/common";

const fields = {
    count: 20
};

const additional = {
    deleted: false,
    selected: false,
    formatted: true
};

export default {
    namespaced: true,

    state: () => ({
        cache: {},
        current: null
    }),

    actions: {
        LOAD: async ({ dispatch, state, rootState }, data) => {
            const isSearch = Boolean(data.start_message_id);

            if (data.id in state.cache) {
                if (!isSearch) {
                    return state.cache[data.id];
                }

                state.cache[data.id].messages = [];
            }

            const history = await rootState.vk.client.api.messages.getHistory({
                offset: isSearch ? undefined : (data.offset || 0),
                start_message_id: data.start_message_id,
                peer_id: data.id,
                ...fields
            });

            state.cache[data.id] = {
                id: data.id,
                count: history.count,
                search: isSearch,
                messages: await dispatch("FORMAT_MESSAGES", history.items),
                conversation: await dispatch("vk/conversations/GET_CONVERSATION_CACHE", data.id, { root: true })
            };

            return state.cache[data.id];
        },

        APPEND: async ({ dispatch, state, rootState  }, id) => {
            const history = await rootState.vk.client.api.messages.getHistory({
                offset: state.cache[id].messages.length,
                peer_id: id,
                ...fields
            });

            const formatted = await dispatch("FORMAT_MESSAGES", history.items);
            state.cache[id].messages = formatted.concat(state.cache[id].messages);
            return state.cache[id];
        },

        FORMAT_MESSAGES: (_, items) => {
            if (items.length === 1 && items[0].formatted) {
                return items;
            }

            return items.map(item => ({
                ...item,
                ...additional
            })).reverse();
        },

        FLUSH: ({ state }, conversation) => {
            const messages = state.cache[conversation.id].messages;
            if (messages.length > fields.count) {
                messages.splice(0, messages.length - fields.count - 1);
            }

            return true;
        },

        UNSELECT_ALL: ({ state }) => {
            state.cache[state.current.id].messages.filter(message => {
                return message.selected;
            }).forEach(message => {
                message.selected = false;
                return message;
            });

            return true;
        },

        CLEAR: ({ state }, conversation) => {
            delete state.cache[conversation.id];
            return true;
        },

        ADD_MESSAGE: async ({ dispatch, state, rootState }, data) => {
            data = await dispatch("PREPARE_DATA", data);

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

        PREPARE_DATA: ({ rootState }, data) => {
            data.payload.message.peer_id = data.isGroup
                ? -Math.abs(data.payload.message.peer_id)
                : data.payload.message.peer_id;

            data.payload.message.random_id = data.payload.message.random_id || common.getRandom(10, 99999999);
            data.payload.message.out = Number(data.payload.message.out 
                || data.payload.message.from_id === rootState.vk.user.id);

            return data;
        },

        SYNC: async ({ dispatch, state }, message) => {
            const messages = state.cache[message.peer_id]?.messages;
            if (!messages) {
                return false;
            }

            const formatted = await dispatch("FORMAT_MESSAGES", [message]); 
            message = formatted[0];

            let messageIndex = message.random_id > 0 ? findLastIndex(messages, msg => {
                return msg.id === message.id;
            }) : -1;

            if (!~messageIndex && message.random_id > 0) {
                messageIndex = findLastIndex(messages, msg => {
                    return msg.random_id === message.random_id;
                });
            }
            
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

        SYNC_VISIBLE: ({ state }, { message, deleted }) => {
            if (!(message.peer_id in state.cache)) {
                return false;
            }

            state.cache[message.peer_id].count--;
            if (!state.cache[message.peer_id].messages) {
                return false;
            }

            const cached = state.cache[message.peer_id].messages.find(msg => {
                return msg.id === message.id;
            });

            cached.deleted = deleted;
            return Boolean(cached);
        },

        SYNC_DELETE: async ({ dispatch }, message) => {
            return await dispatch("SYNC_VISIBLE", { 
                message,
                deleted: true
            });
        },

        SYNC_RESTORE: async ({ dispatch }, message) => {
            return await dispatch("SYNC_VISIBLE", { 
                message,
                deleted: false
            });
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
                fwd_messages: data.forward_messages || [],
                date: Math.floor(Date.now() / 1000),
                out: 1,
                syncing: 1,
                ...data
            };

            if (!toSend.reply_to && data.forward_messages) {
                toSend.forward_messages = data.forward_messages.map(message => {
                    return message.id;
                }).join(",") || "";
            }

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

            return await rootState.vk.client.api.messages.send(toSend)
                .then(() => dispatch("SEND_OFFLINE"))
                .catch(e => {
                    console.warn(e);
                    dispatch("UPDATE_CURRENT");
                });
        },

        EDIT: async ({ dispatch, rootState }, message) => {
            const toEdit = {
                attachment: "",
                peer_id: message.peer_id,
                message: message.text,
                message_id: message.id,
                keep_forward_messages: 1,
                keep_snippets: 1
            };

            dispatch("SYNC", message);
            dispatch("vk/conversations/EDIT_SYNC", message, { root: true });

            if (message.attachments.length > 0) {
                const attachments = await dispatch("UPLOAD", message.attachments);
                message.attachments = attachments.uploaded;
                toEdit.attachment = attachments.ids;
            }

            return await rootState.vk.client.api.messages.edit(toEdit);
        },

        DELETE: async ({ dispatch, rootState }, data) => {
            data.delete_for_all = Number(data.delete_for_all) || 0;
            data.spam = Number(data.spam) || 0;
            
            if (data.messages) {
                data.messages.forEach(message => dispatch("SYNC_DELETE", message));
                return await rootState.vk.client.api.messages.delete({
                    message_ids: data.messages.map(message => message.id).join(","),
                    ...data
                });
            }

            dispatch("SYNC_DELETE", data.message);
            return await rootState.vk.client.api.messages.delete({
                message_ids: data.message.id,
                peer_id: data.message.peer_id,
                ...data
            });
        },

        UPLOAD: async ({ dispatch, rootState }, attachments) => {
            const server = await rootState.vk.client.api.photos.getMessagesUploadServer();
            const uploaded = await Promise.map(attachments, async attachment => {
                if (!("path" in attachment)) {
                    return attachment;
                }

                attachment.uploading = true;

                const saved = await dispatch("UPLOAD_ON_SERVER", {
                    path: attachment.path,
                    server,
                    save: upload => rootState.vk.client.api.photos.saveMessagesPhoto(upload)
                });

                attachment.uploading = false;
                fs.remove(attachment.path);

                return {
                    type: attachment.type,
                    [attachment.type]: saved[0]
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

        UPLOAD_ON_SERVER: async ({ dispatch, rootState }, data) => {
            const upload = await rootState.vk.client.upload.upload(data.server.upload_url, { 
                formData: await dispatch("PREPARE_FORMDATA", data.path)
            });

            return await data.save(upload);
        },

        READ: async ({ rootState }, chat) => {
            const canRead = !rootState.settings.settings.vk.disable_read 
                && !chat.search 
                && chat.messages.length > 0
                && chat.conversation.information.unread_count > 0
                && await ipcRenderer.invoke("focused");

            if (!canRead) {
                return false;
            }

            const message = chat.messages[chat.messages.length - 1];
            if (message.out) {
                return false;
            }

            return await rootState.vk.client.api.messages.markAsRead({
                peer_id: message.peer_id,
                start_message_id: message.id
            });
        },

        SEND_TYPING: async ({ rootState }, id) => {
            if (rootState.settings.settings.vk.disable_write) {
                return false;
            }

            return await rootState.vk.client.api.messages.setActivity({
                peer_id: id,
                type: "typing"
            });
        },

        SEND_OFFLINE: async ({ rootState }) => {
            if (!rootState.settings.settings.vk.send_offline) {
                return false;
            }

            return await rootState.vk.client.api.account.setOffline();
        },

        UPDATE_CURRENT: async ({ state, rootState }) => {
            const list = await rootState.vk.client.api.messages.getConversationsById({
                peer_ids: state.current.id,
                extended: 1
            });

            const conversation = list.items[0];
            if (conversation.peer.id === state.current.id) {
                state.current.information = conversation;
            }

            return true;
        },

        FIND_MESSAGE: ({ state }, data) => {
            if (!(data.peerId in state.cache)) {
                return {
                    index: -1,
                    message: null
                };
            }

            return state.cache[data.peerId].messages.find(message => {
                return message.id === data.id;
            });
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