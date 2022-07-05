/* eslint-disable no-undef */

import { app } from "electron";
import fs from "fs";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

const clear = {
    settings: {
        width: 380,
        height: 530,

        appearance: {
            conversationsWidth: 300,
            minimized: false,

            stickersTheme: 1
        },

        player: {
            volume: 50
        },
        
        hideOnClose: false
    },

    vk: {
        token: "",
        user: 0
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
        const differentTypes = settingType !== typeof clear[key];
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
    temp: path.join(app.getPath("temp"), "vkgram")
};

if (!fs.existsSync(paths.temp)) {
    fs.mkdirSync(paths.temp);
}

Object.keys(clear).map(key => {
    paths[key] = dataPath(`${key}.json`);
});

const config = {
    vk: dataNested(paths.vk, clear.vk),
    settings: dataNested(paths.settings, clear.settings),
    paths
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