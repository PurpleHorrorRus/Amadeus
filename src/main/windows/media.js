/* eslint-disable no-undef */
import { BrowserWindow, clipboard, ipcMain, nativeImage, nativeTheme, shell } from "electron";
import fetch from "node-fetch";

import common from "../common";

nativeTheme.themeSource = "system";

const params = {
    title: "Amadeus Media Preview",

    fullscreen: true,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    show: false,

    webPreferences: common.webPreferences
};

const nativeImageFromURL = async url => {
    const data = await fetch(url);
    const buffer = await data.buffer();
    return nativeImage.createFromDataURL(`data:image/jpeg;base64,${buffer.toString("base64")}`);
};

class MediaWindow {
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

        ipcMain.on("share", (_, attachment) => {
            common.windows.send(this.mainWindow, "share", attachment);
        });

        ipcMain.on("src", async (_, image) => {
            clipboard.writeText(image);
        });

        ipcMain.on("image", async (_, image) => {
            clipboard.writeImage(await nativeImageFromURL(image));
        });

        this.window.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: "deny" };
        });

        // this.window.openDevTools();
        this.window.show();
        await common.windows.load(this.window, "media");

        this.window.webContents.on("before-input-event", (_, input) => {
            if (input.type !== "keyDown") {
                return false;
            }

            switch (input.code) {
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

export default MediaWindow;