import { BrowserWindow, ipcMain, screen } from "electron";

import common from "../common";

const params = {
    height: 900,
    width: 350,

    show: false,
    title: "Amadeus notifier",
    transparent: true,
    movable: false,
    resizable: false,
    frame: false,
    flashFrame: false,
    skipTaskbar: true,
    background: "#131313",
    webPreferences: common.webPreferences
};

class NotifierWindow {
    constructor(mainWindow) {
        this.window = null;
        this.mainWindow = mainWindow;
    }

    async create() {
        const position = this.getPosition();
        this.window = new BrowserWindow({
            ...params,
            parent: this.mainWindow,
            modal: false,
            x: position[0],
            y: position[1]
        });

        this.window.showInactive();
        this.window.removeMenu();
        this.window.setAlwaysOnTop(true, "pop-up-menu");
        this.window.setIgnoreMouseEvents(true, { forward: true });
        await common.windows.load(this.window, "notifier");
        // this.window.webContents.openDevTools({ mode: "undocked" });

        ipcMain.on("notifierClickable", (_, ignore) => {
            this.window.setIgnoreMouseEvents(ignore, { forward: true });
        });

        return this.window;
    }

    getPosition() {
        const { width, height } = screen.getPrimaryDisplay().bounds;
        return [width - params.width - 5, height - params.height - 50];
    }
}

export default NotifierWindow;