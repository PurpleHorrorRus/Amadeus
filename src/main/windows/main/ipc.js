import { dialog } from "electron";

import MediaWindow from "../media";

import common from "../../common";
import Updater from "../../updater";

class IPC {
    constructor(window) {
        this.window = window;

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

        this.events.openMedia = media => new MediaWindow().create(media, this.window);
        this.events.minimize = () => this.window.minimize();

        this.events.maximize = () => {
            return !this.window.isMaximized()
                ? this.window.maximize()
                : this.window.unmaximize(); 
        };

        this.events.registerUpdater = () => {
            this.window.updater = new Updater(this.window);
            this.window.updater.init();
        };
    }
}

export default IPC;