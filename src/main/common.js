/* eslint-disable indent */
/* eslint-disable no-undef */
import path from "path";
import os from "os";
import { app } from "electron";

import storage from "./storage";
import WindowsLogic from "./windows/logic";

app.getVersion = () => "2.4.0";

const isWindows11 = process.platform === "win32" 
    && os.release().substring(0, 6) === "10.0.2";

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

const getBuildResourcePath = file => {
    return process.platform === "win32"
        ? path.normalize(`build/icons/${file}`)
        : path.resolve(__dirname, `../../../../build/icons/${file}`);
};

export default {
    icon: getBuildResourcePath("icon.ico"),
    noCover: getBuildResourcePath("no-cover.png"),
    isDev: process.env.NODE_ENV === "development",
    getBuildResourcePath,
    webPreferences,
    storage,
    windows: new WindowsLogic(),

    isWindows: process.platform === "win32",
    isWindows11
};