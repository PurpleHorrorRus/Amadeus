import path from "path";
import fs from "fs-extra";

import Attachment from "~/instances/Messages/Attachment";
import Photo from "~/instances/Messages/Attachments/Photo";
import { TMessage } from "~/instances/Types/Messages";

import common from "~/plugins/common";

export default {
    namespaced: true,

    state: () => ({
        message: "",
        attachments: [],
        fwd_messages: [],
        reply: null,

        editing: {
            enable: false,
            message: null
        }
    }),

    actions: {
        SET_MESSAGE: ({ state }, text: string) => {
            state.message = text;
            return state.message;
        },

        INSERT_MESSAGE: ({ state }, text) => {
            state.message += text;
            return state.message;
        },

        SET_ATTACHMENTS: ({ state }, attachments: Attachment[]) => {
            state.attachments = attachments;
            return state.attachments;
        },

        ADD_ATTACHMENT: ({ state }, attachment: Attachment) => {
            state.attachments.push(attachment);
            return true;
        },

        MOVE_ATTACHMENTS: ({ state }, moved) => {
            state.attachments = common.arrayMove(state.attachments, moved.oldIndex, moved.newIndex);
        },

        REMOVE_ATTACHMENT: ({ state }, index: number) => {
            if (state.attachments[index].temp) {
                fs.remove(state.attachments[index].path);
            }

            state.attachments.splice(index, 1);
            return state.attachments;
        },

        ADD_PHOTO_PATH: async ({ dispatch, rootState }, data) => {
            const photo: Photo = new Photo({
                album_id: -1,
                date: Math.floor(Date.now() / 1000),
                id: Date.now(),
                owner_id: rootState.vk.user.id,
                has_tags: false,

                sizes: [{
                    width: 1,
                    height: 1,
                    url: data.file
                }]
            }, {
                path: data.file,
                temp: data.temp
            });

            return await dispatch("ADD_ATTACHMENT", photo);
        },

        ADD_PHOTO_CLIPBOARD: async ({ dispatch, rootState }, item) => {
            const blob = item.getAsFile();

            const filename = Date.now() + ".jpg";
            const savePath = path.resolve(rootState.config.paths.temp, filename);
            // eslint-disable-next-line no-undef
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            fs.writeFileSync(savePath, buffer, "binary");

            return await dispatch("ADD_PHOTO_PATH", {
                file: savePath,
                temp: true
            });
        },

        SET_FORWARD: ({ dispatch, state }, messages: TMessage[]) => {
            if (state.reply) {
                dispatch("REMOVE_REPLY");
            }

            state.fwd_messages = messages;
            return state.fwd_messages;
        },

        REMOVE_FORWARD: ({ state }) => {
            if (state.fwd_messages.length === 0) {
                return false;
            }

            state.fwd_messages = [];
            return state.fwd_messages;
        },

        ADD_REPLY: async ({ dispatch, state }, message: TMessage) => {
            if (state.editing.enable) {
                return false;
            }

            if (state.fwd_messages.length > 0) {
                dispatch("REMOVE_FORWARD");
            }

            if (state.reply) {
                await dispatch("REMOVE_REPLY");
            }

            state.reply = message;
            return state.reply;
        },

        REMOVE_REPLY: ({ state }) => {
            if (state.editing.enable) {
                return false;
            }

            state.reply = null;
            return true;
        },

        EDIT: ({ state }, message: TMessage) => {
            state.attachments = [...message.attachments];
            state.reply = message.reply_message;
            state.fwd_messages = message.fwd_messages;

            state.editing.message = message;
            state.editing.enable = true;

            return true;
        },

        CLEAR_EDIT: async ({ dispatch, state }) => {
            state.editing.enable = false;
            state.editing.message = null;
            return await dispatch("CLEAR");
        },

        CLEAR: ({ state }) => {
            state.message = "";
            state.attachments = [];
            state.fwd_messages = [];
            state.reply = null;
            return true;
        }
    }
};