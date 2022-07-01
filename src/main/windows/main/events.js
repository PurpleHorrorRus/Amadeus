import { ipcMain } from "electron";

import common from "../../common";

class MainWindowEvents {
    constructor(window) {
        this.window = window;
    }

    resized() {
        const [width, height] = this.window.getSize();
        common.storage.config.settings.width = width;
        common.storage.config.settings.height = height;
        common.storage.save("settings", common.storage.config.settings);
    }
}

export default MainWindowEvents;