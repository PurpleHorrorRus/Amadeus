import { ipcRenderer } from "electron";
import { UpdateInfo } from "electron-updater";
import Conversation from "~/instances/Conversations/Convesration";

import events from "~/store/modules/ipc/events";

export default {
    namespaced: true,

    state: () => ({
        registered: false
    }),

    actions: {
        REGISTER: ({ dispatch, state }) => {
            if (state.registered) {
                return false;
            }

            ipcRenderer.on("share", (_, attachment) => {
                return dispatch("events/SHARE", attachment);
            });

            ipcRenderer.on("notifierOpen", (_, conversation: Conversation) => {
                dispatch("OPEN_CONVERSATION", conversation, { root: true });
            });

            if (process.platform === "win32") {
                ipcRenderer.on("update", (_, info: UpdateInfo) => {
                    return dispatch("events/UPDATE", info);
                });
            }

            state.registered = true;
            return true;
        }
    },

    modules: {
        events
    }
};