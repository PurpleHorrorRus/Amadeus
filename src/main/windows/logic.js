/* eslint-disable no-undef */
import { BrowserWindow, ipcMain } from "electron";
import common from "../common";

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
                    return resolve(window);
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
            this.updateOverlayIcon(window);

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

    updateOverlayIcon(window) {
        if (!common.isWindows) {
            return false;
        }

        const overlayIcon = window.notificationsCount > 0
            ? common.getIcon(`overlay/overlay-${window.notificationsCount}.png`)
            : null;

        window.setOverlayIcon(overlayIcon, String(window.notificationsCount));
    }
}

export default WindowLogic;