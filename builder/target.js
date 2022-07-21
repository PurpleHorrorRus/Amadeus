/* eslint-disable no-undef */
const path = require("path");

class BuildTarget {
    constructor() {
        this.iconDir = path.resolve(path.join("build", "icons"));
        this.icon = path.join(this.iconDir, "icon.ico");
    }
}

module.exports = BuildTarget;