/* eslint-disable indent */
/* eslint-disable no-undef */
import { app, BrowserWindow as classicBrowserWindow } from "electron";

import os from "os";
import path from "path";

import storage from "./storage";
import WindowsLogic from "./windows/logic";

app.getVersion = () => "2.4.0";

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
    isWindows: process.platform === "win32",
    isDev: process.env.NODE_ENV === "development",
    getBuildResourcePath,
    webPreferences,
    storage,
    windows: new WindowsLogic()
};