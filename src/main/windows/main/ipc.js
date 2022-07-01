import { app, dialog } from "electron";
import fs from "fs-extra";

import common from "../../common";

class IPC {
    constructor(window) {
        this.window = window;

        this.handlers = {
            config: () => {
                return {
                    paths: common.storage.paths,
                    config: common.storage.config
                };
            },

            select: async params => {
                const { canceled, filePaths } = await dialog.showOpenDialog(params);
                return !canceled ? filePaths : false;
            },

            save: async options => {
                const { canceled, filePath } = await dialog.showSaveDialog(options);
                return !canceled ? filePath : false;
            }
        };

        this.events = {
            save: args => {
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

                common.storage.save(args.type, args.content);
            },

            blog: line => {
                return this.window.logger.blog(line);
            },

            minimize: () => {
                return this.window.minimize();
            },

            maximize: () => {
                !this.window.isMaximized()
                    ? this.window.maximize()
                    : this.window.unmaximize(); 
            },

            clearAuthData: () => {
                fs.removeSync(common.storage.paths.cookies);
                common.storage.clear("vk");
            },

            restoreConnection: async () => {
                return await common.windows.load(this.window, "normal");
            },

            relaunch: () => {
                app.relaunch();
                app.exit();
            }
        };
    }
}

export default IPC;