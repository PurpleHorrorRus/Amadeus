/* eslint-disable no-undef */
import { app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";

import common from "./common";

class Updater {
    constructor(window) {
        Object.defineProperty(app, "isPackaged", {
            get() {
                return true;
            }
        });

        this.window = window;

        autoUpdater.currentVersion = app.getVersion();
        autoUpdater.allowPrerelease = true;
        autoUpdater.autoDownload = false;
        autoUpdater.autoInstallOnAppQuit = false;
        autoUpdater.on("error", () => ({}));

        autoUpdater.setFeedURL({
            provider: "github",
            repo: "Amadeus",
            owner: "PurpleHorrorRus",
            private: true
        });
    }

    init() {
        autoUpdater.on("update-available", async info => {
            common.windows.send(this.window, "update", info);

            ipcMain.removeAllListeners("install-update");
            ipcMain.once("install-update", () => {
                autoUpdater.on("download-progress", progress => {
                    common.windows.send(this.window, "update-progress", progress);
                });

                autoUpdater.once("update-downloaded", () => this.install());
                autoUpdater.downloadUpdate();
            });
        });

        setInterval(() => this.check(), 60 * 1000 * 5);
        this.check();
    }

    check() {
        autoUpdater.checkForUpdates();
    }

    install() {
        common.windows.closeAll();
        autoUpdater.quitAndInstall(true, true);
    }
}

export default Updater;