import { UpdateInfo } from "electron-updater";
import { MessagesMessageAttachment } from "vk-io/lib/api/schemas/objects";
import Attachment from "~/instances/Messages/Attachment";
import AttachmentGenerator from "~/instances/Messages/Attachments/Generator";

export default {
    namespaced: true,

    state: () => ({}),

    mutations: {
        REDIRECT(_, url) {
            this.$router.replace(url).catch(() => ({}));
        }
    },

    actions: {
        SHARE: ({ commit, dispatch }, attachment: MessagesMessageAttachment) => {
            dispatch("modal/OPEN", {
                view: "choose-user",
                title: global.$nuxt.$strings.MENU.SHARE,

                function: async conversation => {
                    commit("REDIRECT", `/messages/${conversation.id}?type=${conversation.type}`);

                    const generated: Attachment | MessagesMessageAttachment
                        = AttachmentGenerator.generate(attachment);

                    return dispatch("input/ADD_ATTACHMENT", generated, { root: true });
                }
            }, { root: true });
        },

        UPDATE: ({ dispatch }, release: UpdateInfo) => {
            return dispatch("updater/NOTIFY", release, { root: true });
        }
    }
};