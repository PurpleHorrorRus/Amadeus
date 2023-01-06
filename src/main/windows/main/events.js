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

        if (!common.storage.config.window.hideOnClose) {
            common.windows.closeAll();
            return app.quit();
        }

        return common.windows.hide(this.window);
    }

    resized() {
        const [width, height] = this.window.getSize();

        common.storage.config.window.width = width;
        common.storage.config.window.height = height;

        return common.storage.save("window", common.storage.config.window);
    }
}

export default MainWindowEvents;