import { BrowserWindow, ipcMain, nativeTheme, shell } from "electron";

import common from "../common";

import AmadeusTray from "../tray";
import MainWindowEvents from "./main/events";
import IPC from "./main/ipc";
import NotifierWindow from "./notifier";

nativeTheme.themeSource = "system";

const minWidth = 300;
const minHeight = 380;

const params = {
    title: "Amadeus",
    icon: common.getIcon("amadeus-default.ico"),

    width: Math.max(common.storage.config.window.width, minWidth),
    height: Math.max(common.storage.config.window.height, minHeight),

    minWidth,
    minHeight,

    frame: false,
    transparent: false,
    background: "#131313",
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

        this.window.on("close", event => this.window.events.close(event));
        this.window.on("resized", () => this.window.events.resized());

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

        this.window.show();
        this.window.notifier = await new NotifierWindow(this.window).create();

        await common.windows.load(this.window, "normal");

        if (common.storage.config.window.devtools) {
            this.window.webContents.openDevTools({ mode: "undocked" });
        }

        return true;
    }
}

export default VKGramWindow;