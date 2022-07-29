/* eslint-disable no-undef */

import path from "path";
import fs from "fs-extra";
import { app } from "electron";

const isDev = process.env.NODE_ENV === "development";

const clear = {
    settings: {
        width: 380,
        height: 530,

        inputDevice: "default",
        outputDevice: "default",

        startup: false,
        hideOnClose: true,
        devtools: false,

        vk: {
            mute: [],
            disable_write_whitelist: [],
            disable_read_whitelist: [],

            disable_notifications: false,
            disable_read: false,
            disable_write: false,
            send_offline: false
        },

        appearance: {
            theme: "vk-black",

            conversationsWidth: 300,
            minimized: false,

            stickersTheme: 1,

            messages: {
                background: {
                    url: "",
                    width: 100,
                    height: 100,
                    zoom: 1,
                    x: 0,
                    y: 0
                }
            },

            colors: {
                message: "#242424",
                out: "#71aaeb"
            }
        },

        player: {
            volume: 50
        }
    },

    vk: {
        active: -1,
        accounts: []
    },

    stickers: {
        updated: 0,
        response: { items: [] },
        keywordsResponse: { dictionary: [] }
    }
};

const appdata = app.getPath("userData");
const configPath = path.join(appdata, "config");

const checkDirs = dirs => {
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    });
};

const rootPath = isDev ? path.join(configPath, "Amadeus") : configPath;
checkDirs([rootPath]);

const nested = (settings, clear) => {
    if (!clear) {
        return settings;
    }

    const clearKeys = Object.keys(clear);
    for (const key of clearKeys) {
        const settingType = typeof settings[key];
        // eslint-disable-next-line valid-typeof
        const differentTypes = settingType !== typeof clear[key];
        // eslint-disable-next-line no-mixed-operators
        const isNewKey = !(key in settings) && key in clear || differentTypes;
        const settingIsArray = Array.isArray(settings[key]);

        if (isNewKey) {
            settings[key] = clear[key];
        } else if (settingType === "object" && !settingIsArray) {
            settings[key] = nested(settings[key], clear[key]);
        }
    }

    const settingsKeys = Object.keys(settings);
    for (const key of settingsKeys) {
        if (key in settings && !(key in clear)) {
            delete settings[key];
        }
    }

    return settings;
};

const dataPath = filename => path.join(rootPath, filename);
const dataNested = (path, clear, skip = false) => {
    if (fs.existsSync(path)) {
        const content = fs.readJsonSync(path);
        return !skip ? nested(content, clear) : content;
    }

    fs.writeJsonSync(path, clear);
    return clear;
};

const paths = {
    rootPath,
    vk: path.join(rootPath, "vk.json"),
    settings: path.join(rootPath, "settings.json"),
    stickers: path.join(rootPath, "stickers.json"),
    temp: path.join(app.getPath("temp"), "amadeus"),
    background: path.join(rootPath, "background")
};

if (!fs.existsSync(paths.temp)) {
    fs.mkdirSync(paths.temp);
}

if (!fs.existsSync(paths.background)) {
    fs.writeFileSync(paths.background, "");
}

Object.keys(clear).map(key => {
    paths[key] = dataPath(`${key}.json`);
    return clear[key];
});

const config = {
    vk: dataNested(paths.vk, clear.vk),
    settings: dataNested(paths.settings, clear.settings),
    stickers: dataNested(paths.stickers, clear.stickers, true),
    paths,
    background: fs.readFileSync(paths.background, "base64url")
};

export default {
    paths,
    config,

    save: data => {
        config[data.type] = data.content;
        return fs.writeJsonSync(paths[data.type], data.content, {
            spaces: data.space === 0 ? 0 : (data.space || 4)
        });
    },

    clear: type => {
        config[type] = clear[type];
        return fs.writeFileSync(paths[type], config[type]);
    }
};