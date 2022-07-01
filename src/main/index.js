/* eslint-disable no-undef */
import { app, ipcMain } from "electron";

import common from "./common";
import protocol from "./protocol";

import VKGramWindow from "./windows/main";

if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    // app.commandLine.appendSwitch("js-flags", "--max-old-space-size=512 --stack-size=128");
    app.commandLine.appendSwitch("enable-features", "SharedArrayBuffer");

    if (!common.isWindows) {
        app.commandLine.appendSwitch("enable-transparent-visuals");
    }

    if (!common.isWindows) {
        app.disableHardwareAcceleration();
    }

    app.once("ready", () => {
        if (!common.isDev) {
            protocol.register();
        }

        ipcMain.on("changeStartup", (_, sequence) => {
            app.setLoginItemSettings({
                openAtLogin: sequence,
                enabled: sequence,
                name: "VKGram",
                path: process.execPath,
                args: process.argv
            });
        });

        new VKGramWindow().create();
    });
}