import AudioMessage from "~/instances/Messages/Attachments/AudioMessage";
import Doc from "~/instances/Messages/Attachments/Doc";
import Video from "~/instances/Messages/Attachments/Video";

export default {
    namespaced: true,

    state: () => ({}),

    actions: {
        UPLOAD_VIDEO: async ({ dispatch, rootState }, file) => {
            const video = new Video({
                owner_id: rootState.vk.user.id
            }, { 
                path: file,
                temp: false
            });

            const upload = await video.upload(rootState.vk.client);
            return await dispatch("input/ADD_ATTACHMENT", upload, { root: true });
        },

        UPLOAD_DOC: async ({ dispatch, rootState }, file) => {
            const doc = new Doc({}, {
                path: file,
                temp: false
            });

            const upload = await doc.upload(rootState.vk.client);
            return await dispatch("input/ADD_ATTACHMENT", upload, { root: true });
        },

        UPLOAD_AUDIO_MESSAGE: async ({ rootState }, file) => { 
            const audioMessage = new AudioMessage({}, {
                path: file,
                temp: true
            });

            return await audioMessage.upload(rootState.vk.client);
        }
    }
};