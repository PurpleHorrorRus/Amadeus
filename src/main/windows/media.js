/* eslint-disable no-undef */
import { BrowserWindow, ipcMain, nativeTheme, shell } from "electron";

import common from "../common";

nativeTheme.themeSource = "system";

const params = {
    title: "VKGram Media Preview",

    fullscreen: true,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    show: false,

    webPreferences: common.webPreferences
};

class MeridiusWindow {
    constructor() {
        this.window = null;
        this.mainWindow = null;
    }

    async create(media, mainWindow) {
        this.mainWindow = mainWindow;

        this.window = new BrowserWindow(params);
        this.window.setSkipTaskbar(true);
        this.window.setAlwaysOnTop(true, "screen-saver");

        ipcMain.handleOnce("requestMedia", () => {
            return media;
        });

        ipcMain.once("close", () => {
            return this.close();
        });

        this.window.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: "deny" };
        });

        this.window.show();
        await common.windows.load(this.window, "media");

        this.window.webContents.on("before-input-event", (_, input) => {
            if (input.type !== "keyDown") {
                return false;
            }

            switch(input.code) {
                case "ArrowRight": {
                    common.windows.send(this.window, "changeMedia", 1);
                    break;
                }

                case "ArrowLeft": {
                    common.windows.send(this.window, "changeMedia", -1);
                    break;
                }

                case "Escape": {
                    return this.close();
                }
            }
        });

        return true;
    }

    close() {
        ipcMain.removeHandler("requestMedia");
        ipcMain.removeAllListeners("close");
        return this.window.close();
    }
}

export default MeridiusWindow;