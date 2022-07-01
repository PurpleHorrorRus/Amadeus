/* eslint-disable no-undef */
import { BrowserWindow, ipcMain, nativeTheme, shell } from "electron";

import common from "../common";

import MainWindowEvents from "./main/events";
import IPC from "./main/ipc";

nativeTheme.themeSource = "system";

const minWidth = 955;
const minHeight = 575;

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
        this.events = null;
        this.ipc = null;
    }

    async create() {
        this.window = new BrowserWindow(params);
        this.window.show();

        this.events = new MainWindowEvents(this.window);
        this.ipc = new IPC(this.window);

        for (const handle of Object.keys(this.ipc.handlers)) {
            ipcMain.handle(handle, this.ipc.handlers[handle]);
        }

        this.window.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: "deny" };
        });

        this.window.webContents.openDevTools();

        await common.windows.load(this.window, "normal");
    }
}

export default MeridiusWindow;