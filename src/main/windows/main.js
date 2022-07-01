/* eslint-disable no-undef */
import { BrowserWindow, ipcMain, nativeTheme, shell } from "electron";

import common from "../common";

import MainWindowEvents from "./main/events";
import IPC from "./main/ipc";

nativeTheme.themeSource = "system";

const params = {
    title: "VKGram",
    icon: common.icon,

    width: 350,
    height: 450,

    frame: false,
    transparent: false,
    webPreferences: common.webPreferences
};

class MeridiusWindow {
    constructor() {
        this.window = null;
    }

    async create() {
        this.window = new BrowserWindow(params);

        this.window.events = new MainWindowEvents(this.window);
        this.window.ipc = new IPC(this.window);

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

export default MeridiusWindow;