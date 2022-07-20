import { ipcRenderer } from "electron";

export default {
    namespaced: true,
    
    state: () => ({
        settings: {}
    }),
    
    actions: {
        SET: ({ state }, settings) => {
            state.settings = settings;
            return settings;
        },

        SAVE: ({ state }, settings) => {
            state.settings = settings;

            ipcRenderer.send("save", {
                type: "settings",
                content: settings
            });

            return settings;
        },

        SAVE_CUSTOM: ({ state }, { type, settings }) => {
            if (type === "settings") {
                state.settings = settings;
            }

            ipcRenderer.send("save", {
                type,
                content: settings
            });

            return settings;
        }
    }
};