import { app } from "electron";

import common from "../../common";

class MainWindowEvents {
    constructor(window) {
        this.window = window;
    }

    close(event) {
        if (event) {
            event.preventDefault();
        }

        if (!common.storage.config.settings.hideOnClose) {
            common.windows.closeAll();
            return app.quit();
        }

        return common.windows.hide(this.window);
    }

    resized() {
        const [width, height] = this.window.getSize();
        common.storage.config.settings.width = width;
        common.storage.config.settings.height = height;
        common.storage.save("settings", common.storage.config.settings);
    }
}

export default MainWindowEvents;