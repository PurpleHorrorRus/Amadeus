import { FormData } from "formdata-node";
import { fileFromPathSync } from "formdata-node/file-from-path";

import fs from "fs-extra";
import { VideoGetResponse, VideoUploadResponse } from "vk-io/lib/api/schemas/responses";
import AttachmentGenerator from "~/instances/Messages/Attachments/Generator";
import Video from "~/instances/Messages/Attachments/Video";
import { TSaveData, TUploadData } from "~/instances/Types/Attachments";
import { VideoSaveResult } from 'vk-io/lib/api/schemas/objects';
import Photo from "~/instances/Messages/Attachments/Photo";
import Attachment from "~/instances/Messages/Attachment";

export default {
    namespaced: true,

    state: () => ({}),

    actions: {
        UPLOAD: async ({ dispatch, rootState }, data: TUploadData): Promise<Attachment> => {
            if (!data.attachment.path) {
                return data.attachment;
            }

            return new Promise(async resolve => {
                const save: TSaveData = (() => { 
                    switch (data.attachment.type) { 
                        case "photo": return {
                            server: data.server
                                ? () => data.server
                                : rootState.vk.client.api.photos.getMessagesUploadServer,

                            method: async upload => {
                                const [saved] = await rootState.vk.client.api.photos.saveMessagesPhoto(upload);
                                return resolve(new Photo(saved));
                            }
                        }
    
                        case "video": return {
                            server: () => rootState.vk.client.api.video.save({
                                name: String(Date.now()),
                                description: "",
                                is_private: 1,
                                wallpost: 0
                            }),

                            method: async upload => {
                                const response: VideoGetResponse = await rootState.vk.client.api.video.get({
                                    owner_id: upload.owner_id,
                                    videos: `${upload.owner_id}_${upload.video_id}`
                                });
                    
                                return resolve(new Video(response.items[0]));
                            }
                        }
                    }
                })();

                data.attachment.uploading = true;

                await dispatch("vk/uploader/UPLOAD_ON_SERVER", {
                    attachment: data.attachment,
                    server: save.server,
                    save: upload => save.method(upload)
                }, { root: true });

                if (data.attachment.temp) {
                    fs.removeSync(data.attachment.path);
                }
    
                data.attachment.uploading = false;
            });
        },

        UPLOAD_ON_SERVER: async ({ dispatch, rootState }, data) => {
            const server = await data.server();
            const upload = await rootState.vk.client.upload.upload(server.upload_url, { 
                formData: await dispatch("PREPARE_FORMDATA", {
                    file: data.attachment.path,
                    field: data.attachment.upload_field,
                    type: data.attachment.upload_type
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