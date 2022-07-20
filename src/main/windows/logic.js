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
            
            const url = isDev ? process.env.DEV_SERVER_URL : "vkgram://./index.html";
            window.loadURL(url);
            console.log("Load page", url);
        });
    }

    send(window, event, content = {}) {
        if (this.isWindowAlive(window)) {
            window.webContents.send(event, content);
        }
    }

    restore(window) {
        if (this.isWindowAlive(window)) {
            window.show();
            window.setSkipTaskbar(false);
            window.focus();
            this.send(window, "throttle", false);
        }
    }

    closeAll() {
        BrowserWindow.getAllWindows().forEach(window => this.close(window));
        return true;
    }

    close(window, event, hide, closeAll = false) {
        if (hide) {
            if (event !== null) {
                event.preventDefault();
            }

            this.send(window, "throttle", true);

            if (window) {
                window.hide();
                window.blur();
                window.setSkipTaskbar(true);
            }
        } else {
            window.removeAllListeners("close");
            window.close();

            if (closeAll) {
                BrowserWindow.getAllWindows().forEach(window => {
                    if (window.webContents.isDevToolsOpened) {
                        window.webContents.closeDevTools();
                    }

                    window.removeAllListeners("close");
                    window.close();
                });

                app.quit();
            }
        }
    }
}

export default WindowLogic;