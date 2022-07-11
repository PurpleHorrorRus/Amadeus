import { ipcRenderer } from "electron";

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

            state.registered = true;
            return true;
        }
    },

    modules: {
        events
    }
};