import fs from "fs-extra";
import path from "path";

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
        ADD_ATTACHMENT: ({ state }, attachment) => {
            if (state.attachments.length === 10) {
                return false;
            }

            state.attachments.push(attachment);
            return true;
        },

        REMOVE_ATTACHMENT: ({ state }, index) => {
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
            const buffer = Buffer.from(await blob.arrayBuffer());
            fs.writeFileSync(savePath, buffer, "binary");

            return await dispatch("ADD_ATTACHMENT", {
                type: "photo",
                filename,
                path: savePath,

                photo: {
                    id: Date.now(),
                    sizes: [{
                        width: 1, height: 1,

                        url: await new Promise(resolve => {
                            const reader = new FileReader();
                            reader.onload = event => resolve(event.target.result);
                            reader.readAsDataURL(blob);
                        })
                    }]
                }
            });            
        },

        ADD_FORWARD: ({ state }, messages) => {
            state.fwd_messages = messages;
            return state.fwd_messages;
        },

        ADD_FORWARD_MODAL: ({ dispatch, state, rootState }) => {
            state.fwd_messages = rootState.modal.target;
            dispatch("modal/CLOSE", null, { root: true });
            return state.fwd_messages;
        },

        REMOVE_FORWARD: ({ state }) => {
            state.fwd_messages = [];
            return state.fwd_messages;
        },

        ADD_REPLY: ({ state }, message) => {
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

        EDIT: ({ state }, message) => {
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