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

        SAVE_CUSTOM: ({ state }, data) => {
            if (data.type === "settings") {
                state.settings = data.settings;
            }

            ipcRenderer.send("save", data);
            return data.content;
        }
    }
};