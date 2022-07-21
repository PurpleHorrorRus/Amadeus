/* eslint-disable no-undef */
import { BrowserWindow, ipcMain, nativeTheme, shell } from "electron";

import common from "../common";

import AmadeusTray from "../tray";
import MainWindowEvents from "./main/events";
import IPC from "./main/ipc";

nativeTheme.themeSource = "system";

const minWidth = 300;
const minHeight = 380;

const params = {
    title: "Amadeus",
    icon: common.icon,

    width: Math.max(common.storage.config.settings.width, minWidth),
    height: Math.max(common.storage.config.settings.height, minHeight),

    minWidth,
    minHeight,

    frame: false,
    transparent: false,
    webPreferences: common.webPreferences
};

class VKGramWindow {
    constructor() {
        this.window = null;
    }

    async create() {
        this.window = new BrowserWindow(params);

        this.window.events = new MainWindowEvents(this.window);
        this.window.ipc = new IPC(this.window);

        this.window.tray = new AmadeusTray(this.window);
        this.window.tray.build();

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

        if (common.isWindows) {
            ipcMain.once("register-updater", () => {
                return this.window.ipc.events.registerUpdater();
            });
        }

        this.window.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: "deny" };
        });

        if (common.isDev) {
            this.window.webContents.openDevTools();
        }

        this.window.show();

        await common.windows.load(this.window, "normal");
        return true;
    }
}

export default VKGramWindow;