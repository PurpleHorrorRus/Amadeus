import { app, Tray, Menu } from "electron";

import common from "./common";

const trayIcon = common.getIcon("amadeus-default");

class AmadeusTray {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;

        this.tray = new Tray(trayIcon);
        this.tray.setToolTip(common.isDev ? "Amadeus (Development)" : "Amadeus");
        this.tray.on("double-click", () => common.windows.restore(this.mainWindow));

        this.strings = {};
        this.template = [];
    }

    buildTypes() {
        this.types = {
            SHOW: {
                label: "Показать",
                type: "normal",
                click: () => common.windows.restore(this.mainWindow)
            },

            SEPARATOR: {
                type: "separator"
            },

            EXIT: {
                label: "Выход",
                click: async () => {
                    await common.windows.closeAll(this.mainWindow);
                    this.destroy();
                    app.quit();
                }
            }
        };
    }

    build() {
        this.buildTypes();

        this.template = [
            this.types.SHOW,
            this.types.SEPARATOR,
            this.types.EXIT
        ];
        
        const menu = Menu.buildFromTemplate(this.template);
        this.tray.setContextMenu(menu);
    }

    changeLocale(strings) {
        this.strings = strings;
        this.build();
    }

    setIcon(path) {
        this.tray.setImage(path);
    }

    destroy() {
        this.tray.destroy();
        this.tray = null;
    }
}

export default AmadeusTray;