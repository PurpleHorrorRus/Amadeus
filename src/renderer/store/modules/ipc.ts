import { ipcRenderer } from "electron";
import { UpdateInfo } from "electron-updater";

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