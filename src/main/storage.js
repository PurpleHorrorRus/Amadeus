import path from "path";
import fs from "fs-extra";
import { app } from "electron";

const isDev = process.env.NODE_ENV === "development";

const clear = {
    window: {
        width: 380,
        height: 530,
        startup: false,
        hideOnClose: true,
        devtools: false
    },

    general: {
        inputDevice: "default",
        outputDevice: "default"
    },

    vkService: {
        mute: [],

        disableWriteWhitelist: [],
        disableReadWhitelist: [],

        notifications: true,
        read: true,
        write: false,
        offline: false
    },

    appearance: {
        theme: "vk-black",

        conversationsWidth: 300,
        minimized: false,

        stickersTheme: 1,

        messages: {
            background: {
                url: "",
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

class Storage {
    constructor () {
        this.appdata = app.getPath("userData");

        this.root = isDev
            ? path.resolve(this.appdata, "config", "Amadeus")
            : path.resolve(this.appdata, "config");

        this.paths = {
            root: this.root,
            temp: path.resolve(app.getPath("temp"), "amadeus")
        };

        this.config = {};
    }

    checkDirs (dirs) {
        for (const dir of dirs) {
            if (!fs.pathExistsSync(dir)) {
                fs.mkdirsSync(dir);
            }
        }

        return dirs;
    }

    merge (settings, clear) {
        if (!clear) {
            return settings;
        }

        for (const key of Object.keys(clear)) {
            const differentTypes = typeof settings[key] !== typeof clear[key];
            const isNewKey = (!(key in settings) && key in clear) || differentTypes;
            const settingIsArray = Array.isArray(settings[key]);

            if (isNewKey) {
                settings[key] = clear[key];
            } else if (typeof settings[key] === "object" && !settingIsArray) {
                settings[key] = this.merge(settings[key], clear[key]);
            }
        }

        for (const key of Object.keys(settings)) {
            if (key in settings && !(key in clear)) {
                delete settings[key];
            }
        }

        return settings;
    }

    nested (name, skip = false) {
        const path = this.paths[name];
        const clearConfig = clear[name];

        if (fs.existsSync(path)) {
            const content = fs.readJsonSync(path);
            return !skip ? this.merge(content, clearConfig) : content;
        }

        fs.writeJsonSync(path, clearConfig, { spaces: 4 });
        return clearConfig;
    }

    create () {
        this.checkDirs(Object.values(this.paths));

        for (const key of Object.keys(clear)) {
            this.paths[key] = path.resolve(this.root, `${key}.json`);
        }

        this.paths.background = path.resolve(this.root, "background");

        this.config = {
            window: this.nested("window"),
            general: this.nested("general"),
            vkService: this.nested("vkService"),
            appearance: this.nested("appearance"),
            player: this.nested("player"),
            vk: this.nested("vk", true),
            stickers: this.nested("stickers")
        };

        return this;
    }

    save (type, content) {
        this.config[type] = content;
        return fs.writeJsonSync(this.paths[type], content, { spaces: 4 });
    }

    clear (type) {
        this.config[type] = clear[type];
        return fs.writeJsonSync(this.paths[type], this.config[type], { spaces: 4 });
    }
}

export default Storage;