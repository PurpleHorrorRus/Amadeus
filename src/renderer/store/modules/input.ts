import path from "path";
import fs from "fs-extra";

import Attachment from "~/instances/Messages/Attachment";
import Photo from "~/instances/Messages/Attachments/Photo";
import { TMessage } from "~/instances/Types/Messages";

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
        SET_ATTACHMENTS: ({ state }, attachments: Attachment[]) => {
            state.attachments = attachments;
            return state.attachments;
        },
        
        ADD_ATTACHMENT: ({ state }, attachment: Attachment) => {
            if (state.attachments.length === 10) {
                return false;
            }

            state.attachments.push(attachment);
            return true;
        },

        REMOVE_ATTACHMENT: ({ state }, index: number) => {
            if (state.attachments[index].path) {
                fs.remove(state.attachments[index].path);
            }

            state.attachments.splice(index, 1);
            return state.attachments;
        },

        ADD_PHOTO: async ({ dispatch, state, rootState }, item) => {
            if (state.attachments.length === 10) {
                return false;
            }

            const blob = item.getAsFile();

            const filename = Date.now() + ".jpg";
            const savePath = path.resolve(rootState.config.paths.temp, filename);
            // eslint-disable-next-line no-undef
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            fs.writeFileSync(savePath, buffer, "binary");

            const attachment: Attachment = new Photo({
                id: Date.now(),
                owner_id: rootState.vk.user.id,
                album_id: -1,
                has_tags: false,
                date: Math.floor(Date.now() / 1000),

                sizes: [{
                    width: 1,
                    height: 1,

                    url: await new Promise(resolve => { 
                        const reader = new FileReader();
                        reader.onload = event => resolve(String(event.target.result));
                        reader.readAsDataURL(blob);
                    })
                }]
            }, { 
                path: savePath
            });

            return await dispatch("ADD_ATTACHMENT", attachment);
        },

        SET_FORWARD: ({ state }, messages: TMessage[]) => {
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

        ADD_REPLY: ({ state }, message: TMessage) => {
            if (state.editing.enable) {
                return false;
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
            state.attachments = [];
            state.fwd_messages = [];
            state.reply = null;
            return true;
        }
    }
};