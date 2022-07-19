/* eslint-disable no-undef */

import fs from "fs";
import path from "path";
import { app } from "electron";

const isDev = process.env.NODE_ENV === "development";

const clear = {
    settings: {
        width: 380,
        height: 530,

        inputDevice: "default",
        outputDevice: "default",

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
        },
        
        hideOnClose: false
    },

    vk: {
        active: -1,
        accounts: []
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

const rootPath = isDev ? path.join(configPath, "VKGram") : configPath;
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

const readJSON = dir => JSON.parse(fs.readFileSync(dir, "UTF-8"));
const writeJSON = (dir, content) => {
    fs.writeFileSync(dir, JSON.stringify(content, null, 4));
    return content;
};

const dataPath = filename => path.join(rootPath, filename);
const dataNested = (path, clear) => (fs.existsSync(path) ? nested(readJSON(path), clear) : writeJSON(path, clear));

const paths = {
    rootPath,
    vk: path.join(rootPath, "vk.json"),
    settings: path.join(rootPath, "settings.json"),
    temp: path.join(app.getPath("temp"), "vkgram"),
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
    paths,
    background: fs.readFileSync(paths.background, "utf-8")
};

export default {
    paths,
    config,
    readJSON,
    writeJSON,

    save: (type = "settings", content) => {
        config[type] = content;
        return writeJSON(paths[type], content);
    },

    clear: type => {
        config[type] = clear[type];
        return writeJSON(paths[type], config[type]);
    }
};