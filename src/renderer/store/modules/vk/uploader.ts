import fetch from "node-fetch";

import { VideoSaveResult } from "vk-io/lib/api/schemas/objects";
import { VideoSaveParams } from "vk-io/lib/api/schemas/params";
import { VideoGetResponse } from "vk-io/lib/api/schemas/responses";
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

        UPLOAD_VIDEO_EXTERNAL: async ({ rootState }, url): Promise<Video | boolean> => {
            const params: VideoSaveParams = {
                link: url,
                is_private: 1,
                wallpost: 0
            };

            const upload: VideoSaveResult = await rootState.vk.client.api.video.save(params);
            const request = await fetch(upload.upload_url);
            const data = await request.json();

            if (data.response === 1) {
                const response: VideoGetResponse = await rootState.vk.client.api.video.get({
                    owner_id: upload.owner_id,
                    videos: `${upload.owner_id}_${upload.video_id}`
                });

                return new Video(response.items[0]);
            }

            return false;
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