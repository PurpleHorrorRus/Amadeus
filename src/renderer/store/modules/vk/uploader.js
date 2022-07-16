import { FormData } from "formdata-node";
import { fileFromPathSync } from "formdata-node/file-from-path";

import { removeSync } from "fs-extra";

export default {
    namespaced: true,

    state: () => ({}),

    actions: {
        UPLOAD: async ({ dispatch, rootState }, attachment) => {
            if (!("path" in attachment)) {
                return attachment;
            }

            attachment.uploading = true;

            let save = null;
            switch (attachment.type) {
                case "photo": {
                    save = {
                        field: "file",

                        server: attachment.server 
                            ? () => attachment.server 
                            : rootState.vk.client.api.photos.getMessagesUploadServer,

                        method: rootState.vk.client.api.photos.saveMessagesPhoto
                    };

                    break;
                }

                case "video": {
                    save = {
                        field: "video_file",
                        type: "video/mp4",

                        server: () => rootState.vk.client.api.video.save({
                            name: "name",
                            description: "description",
                            is_private: 1,
                            wallpost: 0
                        }),

                        method: upload => upload
                    };

                    break;
                }

                default: {
                    save = {
                        field: "file",
                        server: rootState.vk.client.api.photos.getMessagesUploadServer,
                        method: rootState.vk.client.api.photos.saveMessagesPhoto
                    };
                    
                    break;
                }
            }

            const saved = await dispatch("vk/uploader/UPLOAD_ON_SERVER", {
                path: attachment.path,
                field: save.field,
                type: save.type,
                server: save.server,
                save: upload => save.method(upload)
            }, { root: true });
            
            if (attachment.temp) {
                removeSync(attachment.path);
            }

            attachment.uploading = false;

            return {
                type: attachment.type,
                [attachment.type]: Array.isArray(saved) ? saved[0] : saved
            };
        },

        UPLOAD_ON_SERVER: async ({ dispatch, rootState }, data) => {
            const server = await data.server();
            const upload = await rootState.vk.client.upload.upload(server.upload_url, { 
                formData: await dispatch("PREPARE_FORMDATA", {
                    file: data.path,
                    field: data.field,
                    type: data.type
                }),

                forceBuffer: true
            });

            return await data.save(upload);
        },

        PREPARE_FORMDATA: (_, data) => {
            const form = new FormData();
            form.set(data.field, fileFromPathSync(data.file));
            return form;
        }
    }
};