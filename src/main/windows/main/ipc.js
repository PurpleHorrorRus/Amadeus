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
                console.error("Settings saving type is undefined");
                return;
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
            return this.window.events.close();
        };

        this.events.notifierMessage = conversation => {
            common.windows.send(this.window.notifier, "notifierMessage", conversation);
        };

        this.events.notifierOpen = conversation => {
            this.window.show();
            this.window.focus();
            common.windows.send(this.window, "notifierOpen", conversation);
        };

        this.events.buildNotificationIcon = count => {
            if (count > 9) count = "9-plus";
            else if (count === 0) count = "default";

            const icon = common.getIcon(`amadeus-${count}.ico`);
            this.window.tray.setIcon(icon);
            this.window.notificationsCount = count;
            common.windows.updateOverlayIcon(this.window);
        };

        this.events.registerUpdater = () => {
            this.window.updater = new Updater(this.window);
            this.window.updater.init();
        };

        this.events.openDevTools = () => this.window.openDevTools({ mode: "undocked" });
        this.events.closeDevTools = () => this.window.closeDevTools();

        this.events.clearStickers = () => {
            common.storage.config.stickers = null;
        };
    }
}

export default IPC;