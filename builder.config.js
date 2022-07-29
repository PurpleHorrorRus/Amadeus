/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const LinuxTarget = require("./builder/linux");
const WindowsTarget = require("./builder/windows");

const config = {
    asar: true,
    productName: "Amadeus",
    appId: "com.purplehorrorrus.amadeus",
    // eslint-disable-next-line no-template-curly-in-string
    artifactName: "amadeus-${version}.${ext}",

    directories: {
        output: "build",
        buildResources: "build/resources"
    }
};

const files = [
    "package.json",

    {
        from: "dist/main",
        to: "dist/main/"
    },

    {
        from: "dist/renderer",
        to: "dist/renderer/"
    }
];

const extraResources = [
    {
        from: `./build/icons/${process.platform}`,
        to: `../build/icons/${process.platform}`
    }
];

module.exports = {
    ...config,
    ...new WindowsTarget().config,
    ...new LinuxTarget().config,

    files,
    extraResources,

    publish: {
        provider: "github",
        owner: "PurpleHorrorRus",
        repo: "Amadeus",
        releaseType: "prerelease",
        private: false
    }
};