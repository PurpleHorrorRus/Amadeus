import { ipcRenderer } from "electron";
import { UpdateInfo } from "electron-updater";

export default {
    namespaced: true,

    state: () => ({
        available: false,

        name: "",
        notes: "",
        version: "0.0.0",
        
        active: false,
        progress: 0
    }),

    actions: {
        NOTIFY: ({ state }, release: UpdateInfo) => {
            state.name = release.releaseName;
            state.notes = release.releaseNotes;
            state.version = release.version;

            state.available = true;
        },

        INSTALL: ({ state }) => {
            ipcRenderer.on("update-progress", (_, progress) => {
                state.progress = progress.percent;
            });
            
            state.active = true;
            return ipcRenderer.send("install-update");
        }
    }
};