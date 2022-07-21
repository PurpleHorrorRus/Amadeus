import { ipcRenderer } from "electron";
import Promise from "bluebird";
import lodash from "lodash";
import DateDiff from "date-diff";

import { MessagesEditParams, MessagesSendParams } from "vk-io/lib/api/schemas/params";
import { MessagesGetByIdResponse, MessagesGetHistoryResponse } from "vk-io/lib/api/schemas/responses";

import Message from "~/instances/Messages/Message";
import Attachment from "~/instances/Messages/Attachment";

import common from "~/plugins/common";
import { TChat } from "~/instances/Types/Messages";

import stickers from "~/store/modules/vk/stickers";
import Sticker from "~/instances/Messages/Attachments/Sticker";

const fields = {
    count: 20
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

            const history: MessagesGetHistoryResponse = await rootState.vk.client.api.messages.getHistory({
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

        APPEND: async ({ dispatch, state, rootState }, id) => {
            const history: MessagesGetHistoryResponse = await rootState.vk.client.api.messages.getHistory({
                offset: state.cache[id].messages.length,
                peer_id: id,
                ...fields
            });

            const formatted: Message[] = await dispatch("FORMAT_MESSAGES", history.items);
            state.cache[id].messages = state.cache[id].messages.concat(formatted);
            return state.cache[id];
        },

        FORMAT_MESSAGES: (_, items): Message[] => {
            return items.map(message => {
                return new Message(message);
            });
        },

        FLUSH: ({ state }, conversation): void => {
            const messages: Message[] = state.cache[conversation.id].messages;

            if (messages.length > fields.count) {
                state.cache[conversation.id].messages = messages.splice(0, fields.count);
            }
        },

        UNSELECT_ALL: ({ state }): void => {
            return state.cache[state.current.id].messages.filter(message => {
                return message.selected;
            }).forEach(message => {
                message.select(false);
                return message;
            });
        },

        CLEAR: ({ state }, conversation): void => {
            delete state.cache[conversation.id];
        },

        ADD_MESSAGE: async ({ dispatch, state, rootState }, data) => {
            if (data.payload.message.peer_id in state.cache) {
                const response: MessagesGetByIdResponse = await rootState.vk.client.api.messages.getById({
                    message_ids: data.payload.message.id
                });
                
                const message = new Message(response.items[0]); 
                dispatch("SYNC", message);
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

        SYNC: async ({ state }, message: Message) => {
            const messages: Message[] = state.cache[message.peer_id]?.messages;
            if (!messages) {
                return false;
            }

            let messageIndex: number = message.random_id > 0
                ? messages.findIndex(msg => {
                    return msg.id === message.id;
                })
                : -1;

            if (!~messageIndex && message.random_id > 0) {
                messageIndex = lodash.findLastIndex(messages, msg => {
                    return msg.random_id === message.random_id;
                });
            }
            
            if (~messageIndex) {
                const cacheMessage: Message = messages[messageIndex];
                cacheMessage.id = message.id;
                cacheMessage.syncing = 0;
                return cacheMessage;
            } else {
                messages.unshift(message);
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

            deleted ? cached.delete() : cached.restore();
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
            const toSend: MessagesSendParams = {
                attachment: "",
                peer_id: data.peer_id,
                random_id: common.getRandom(10, 99999999),
                message: data.text || "",
                reply_to: data.reply_message?.id
            };

            const message: Message = new Message({
                id: common.getRandom(100000, 999999),
                peer_id: toSend.peer_id,
                random_id: toSend.random_id,
                from_id: rootState.vk.user.id,
                fwd_messages: data.forward_messages || [],
                date: Math.floor(Date.now() / 1000),
                out: 1,
                syncing: 1,
                ...data
            });

            if (!toSend.reply_to && data.forward_messages) {
                toSend.forward_messages = data.forward_messages.map(message => {
                    return message.id;
                }).join(",");
            }

            dispatch("SYNC", message);
            dispatch("vk/conversations/ADD_MESSAGE", { 
                payload: { message },
                text: message.text
            }, { root: true });

            if (message.attachments.length > 0) {
                if (message.attachments[0].type === "sticker") {
                    delete toSend.attachment;
                    delete toSend.message;
                    delete toSend.reply_to;
                    toSend.sticker_id = data.attachments[0].id;
                } else {
                    const attachments = await dispatch("UPLOAD", message.attachments);
                    message.attachments = attachments.uploaded;
                    toSend.attachment = attachments.ids;
                }
            }

            return await rootState.vk.client.api.messages.send(toSend)
                .then(() => dispatch("SEND_OFFLINE"))
                .catch(error => dispatch("HANDLE_ERROR", { error, data }));
        },

        SEND_STICKER: async ({ dispatch, state }, sticker: Sticker) => { 
            return await dispatch("SEND", {
                attachments: [sticker],
                peer_id: state.current.id
            });
        },

        EDIT: async ({ dispatch, rootState }, message: Message) => {
            dispatch("SYNC", message);
            dispatch("vk/conversations/EDIT_SYNC", message, { root: true });

            const toEdit: MessagesEditParams = {
                attachment: "",
                peer_id: message.peer_id,
                message: message.text,
                message_id: message.id,
                keep_forward_messages: 1,
                keep_snippets: 1
            };

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
                data.messages.forEach(message => {
                    dispatch("SYNC_DELETE", message);
                });

                if (data.delete_for_all) {
                    /*
                        Делим сообщения на те, которые можно удалить для всех и тех, которые нельзя.
                        Отправляем два разных запроса, но удаляем все отмеченные сообщения.
                    */

                    const now = new Date();

                    const [deleteForAll, rest] = lodash.partition(data.messages, (message: Message) => {
                        const diff = new DateDiff(now, new Date(message.date * 1000));
                        return diff.hours() < 24;
                    });

                    if (deleteForAll.length > 0) {
                        await rootState.vk.client.api.messages.delete({
                            message_ids: deleteForAll.map(message => message.id).join(","),
                            delete_for_all: 1
                        });
                    }

                    if (rest.length > 0) {
                        await rootState.vk.client.api.messages.delete({
                            message_ids: rest.map(message => message.id).join(","),
                            delete_for_all: 0
                        });
                    }
                }

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

        HANDLE_ERROR: ({ dispatch }, { error, data }) => { 
            switch (error.code) {
                case 7: { // Ban or other restrictions
                    return dispatch("vk/conversations/RESTRICT", data.peer_id, { root: true });
                }
            }
        },

        UPLOAD: async ({ rootState }, attachments: Attachment[]) => {
            const uploadings: Attachment[] = await Promise.map(attachments, async attachment => {
                if (!attachment.path) {
                    return attachment;
                }

                return await attachment.upload(rootState.vk.client);
            });

            return {
                uploaded: uploadings,

                ids: uploadings.map(uploading => {
                    return `${uploading.type}${uploading.owner_id}_${uploading.id}`;
                })
            };
        },

        READ: async ({ rootState }, chat: TChat) => {
            const canRead: boolean = !rootState.settings.settings.vk.disable_read 
                && !chat.search 
                && chat.messages.length > 0
                && chat.conversation.information.unread_count > 0
                && await ipcRenderer.invoke("focused");

            if (!canRead) {
                return false;
            }

            const message: Message = chat.messages[chat.messages.length - 1];
            if (message.out) {
                return false;
            }
            
            chat.conversation.readIn(message.id);
            return await rootState.vk.client.api.messages.markAsRead({
                peer_id: message.peer_id,
                message_ids: message.id,
                mark_conversation_as_read: 1
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
    },
    
    modules: {
        stickers
    }
};