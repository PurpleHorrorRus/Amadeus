import path from "path";
import { app, dialog } from "electron";

import MediaWindow from "../media";

import common from "../../common";
import Updater from "../../updater";

class IPC {
    constructor(window) {
        this.window = window;
        this.mediaWindow = new MediaWindow();

        this.handlers = {};
        this.events = {};

        this.handlers.config = () => ({
            paths: common.storage.paths,
            config: common.storage.config
        });

        this.handlers.select = async (_, properties) => {
            const { canceled, filePaths } = await dialog.showOpenDialog(properties);
            return !canceled ? filePaths : false;
        };

        this.handlers.save = async (_, options) => {
            const { canceled, filePath } = await dialog.showSaveDialog(options);
            return !canceled ? filePath : false;
        };

        this.handlers.focused = () => {
            return this.window.isFocused();
        };

        this.handlers.getVersion = () => {
            return app.getVersion();
        };

        this.events.save = args => {
            if (!args.content) {
                console.error("Settings content is empty", args.type);
                return;
            }

            if (!args.type) {
                args.type = "settings";
            }

            if (args.type === "settings") {
                common.storage.config.settings = args.content;
            }

            return common.storage.save(args.type, args.content);
        };

        this.events.openMedia = media => {
            return this.mediaWindow.create(media, this.window);
        };

        this.events.minimize = () => {
            return this.window.minimize();
        };

        this.events.maximize = () => {
            return !this.window.isMaximized()
                ? this.window.maximize()
                : this.window.unmaximize(); 
        };

        this.events.close = () => {
            if (!common.storage.config.settings.hideOnClose) {
                common.windows.closeAll();
                return app.quit();
            }
    
            return common.windows.hide(this.window);
        };

        this.events.buildNotificationIcon = count => {
            if (count > 9) count = "9-plus";
            else if (count === 0) count = "default";

            const icon = common.getIcon(`amadeus-${count}`);
            this.window.tray.setIcon(icon);

            if (common.isWindows) {
                const overlayIcon = path.normalize(`build/icons/win32/overlay/overlay-${count}.png`);
                this.window.setOverlayIcon(overlayIcon, "test");
            }
        };

        this.events.registerUpdater = () => {
            this.window.updater = new Updater(this.window);
            this.window.updater.init();
        };

        this.events.openDevTools = () => this.window.openDevTools({ mode: "undocked" });
        this.events.closeDevTools = () => this.window.closeDevTools();
    }
}

export default IPC;