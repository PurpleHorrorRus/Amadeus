/* eslint-disable no-undef */
import { BrowserWindow, ipcMain, nativeTheme, shell } from "electron";

import common from "../common";

import MainWindowEvents from "./main/events";
import IPC from "./main/ipc";

nativeTheme.themeSource = "system";

const minWidth = 300;
const minHeight = 380;

const params = {
    title: "VKGram",
    icon: common.icon,

    width: Math.max(common.storage.config.settings.width, minWidth),
    height: Math.max(common.storage.config.settings.height, minHeight),

    minWidth, minHeight,

    frame: false,
    transparent: false,
    webPreferences: common.webPreferences
};

class MediaWindow {
    constructor() {
        this.window = null;
    }

    async create() {
        this.window = new BrowserWindow(params);

        this.window.events = new MainWindowEvents(this.window);
        this.window.ipc = new IPC(this.window);

        this.window.on("resized", () => {
            const [width, height] = this.window.getSize();
            common.storage.config.settings.width = width;
            common.storage.config.settings.height = height;
            common.storage.save("settings", common.storage.config.settings);
            return true;
        });

        for (const handle of Object.keys(this.window.ipc.handlers)) {
            ipcMain.handle(handle, this.window.ipc.handlers[handle]);
        }

        for (const event of Object.keys(this.window.ipc.events)) {
            ipcMain.on(event, (_, args) => {
                return this.window.ipc.events[event](args);
            });
        }

        this.window.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: "deny" };
        });

        this.window.webContents.openDevTools();
        this.window.show();

        await common.windows.load(this.window, "normal");
        return true;
    }
}

export default MediaWindow;