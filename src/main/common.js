/* eslint-disable indent */
/* eslint-disable no-undef */
import path from "path";
import os from "os";
import { app } from "electron";

import storage from "./storage";
import WindowsLogic from "./windows/logic";

app.getVersion = () => "1.0.0-beta.12";

const isDev = process.env.NODE_ENV === "development";
const isWindows = process.platform === "win32";
const isWindows11 = isWindows && os.release().substring(0, 6) === "10.0.2";

const webPreferences = {
    contextIsolation: false,
    webSecurity: false,
    nodeIntegration: true,
    backgroundThrottling: true,
    spellcheck: false,
    enableRemoteModule: false,
    devTools: true,
    webgl: false,
    enableWebSQL: false,
    v8CacheOptions: "none"
};

const getIcon = file => {
    if (isWindows) {
        const pathToFile = `build/icons/win32/${file}`;
        return isDev
            ? path.join(process.execPath, "../../../..", pathToFile)
            : path.join(process.execPath, "..", pathToFile);
    }

    return path.resolve(__dirname, "../../../..", `build/icons/linux/${file}.png`);
};

export default {
    isDev,
    getIcon,
    webPreferences,
    storage,
    windows: new WindowsLogic(),

    isWindows,
    isWindows11
};