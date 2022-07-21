/* eslint-disable no-undef */
const BuildTarget = require("./target");

class WindowsTarget extends BuildTarget {
    constructor() {
        super();

        this.config = {
            win: {
                icon: this.icon,
                publisherName: "PurpleHorrorRus",
                target: "nsis",
                verifyUpdateCodeSignature: false
            },
        
            nsis: {
                perMachine: true,
                oneClick: false,
                allowToChangeInstallationDirectory: true,
                differentialPackage: true,
        
                installerSidebar: "build/resources/installerSidebar.bmp",
                uninstallerSidebar: "build/resources/uninstallerSidebar.bmp"
            }
        };
    }
}

module.exports = WindowsTarget;