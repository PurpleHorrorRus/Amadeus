import { app, dialog } from "electron";

import common from "../../common";

class IPC {
    constructor(window) {
        this.window = window;

        this.handlers = {
            config: () => ({
                paths: common.storage.paths,
                config: common.storage.config
            }),

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
            
            minimize: () => {
                this.window.minimize();
            },

            title: (tray, song) => {
                const title = song.full_id !== "-1_-1" ? `${song.performer} - ${song.title}` : "Meridius";
                this.window.setTitle(title);
                tray.changeTooltip(title);
            },

            restoreConnection: async () => await common.windows.load(this.window, "normal"),

            relaunch: () => {
                app.relaunch();
                app.exit();
            }
        };
    }
}

export default IPC;