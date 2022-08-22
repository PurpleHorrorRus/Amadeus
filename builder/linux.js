/* eslint-disable no-undef */
const path = require("path");

const BuildTarget = require("./target");

class LinuxTarget extends BuildTarget {
    constructor() {
        super();

        this.config = {
            linux: {
                icon: path.join(this.iconDir, "png"),
                target: ["tar.gz"]
            }
        };
    }
}

module.exports = LinuxTarget;