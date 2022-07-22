/* eslint-disable no-undef */
import { app, BrowserWindow, ipcMain } from "electron";

const isDev = process.env.NODE_ENV === "development";
class WindowLogic {
    isWindowAlive(window) {
        return window && !window.isDestroyed();
    }

    load(window, type) {
        return new Promise(resolve => {
            ipcMain.on("dom-ready", () => {
                if (this.isWindowAlive(window)) {
                    this.send(window, type);
                    return resolve();
                }
            });
            
            const url = isDev ? process.env.DEV_SERVER_URL : "amadeus://./index.html";
            window.loadURL(url);
            console.log("Load page", url);
        });
    }

    send(window, event, content = {}) {
        if (!this.isWindowAlive(window)) {
            return false;
        }

        return window.webContents.send(event, content);
    }

    hide(window) {
        window.hide();
        window.blur();
        window.setSkipTaskbar(true);

        return true;
    }

    restore(window) {
        if (this.isWindowAlive(window)) {
            window.show();
            window.setSkipTaskbar(false);
            window.focus();

            return true;
        }

        return false;
    }

    close(window) {
        if (window.webContents.isDevToolsOpened()) {
            window.webContents.closeDevTools();
        }

        window.removeAllListeners("close");
        window.close();

        return true;
    }

    closeAll() {
        BrowserWindow.getAllWindows().forEach(window => this.close(window));
        return true;
    }
}

export default WindowLogic;